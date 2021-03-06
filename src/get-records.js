const agent = require('xcii-agent');
const cheerio = require('cheerio');
const {CARADISIAC, HEADERS, YEARS} = require('./constants');
const pSettle = require('p-settle');
const {search} = require('./api');
const url = require('url');

/**
 * Fetch list of collections for a given brand
 * @param  {String}  brand
 * @param  {Object}  configuration
 * @return {Promise}               [description]
 */
const getCollections = async (brand, configuration) => {
  const payload = {
    'makes': brand,
    'models': 0,
    'year': 0,
    'type': 'models'
  };

  return await search(payload, configuration);
};

/**
 * Format payloads to fetch records
 * @param  {String}  brand
 * @param  {Array}  collections
 * @param  {Object}  configuration
 * @return {Promise}
 */
const getPayloads = async (brand, collections, configuration) => {
  const promises = collections.map(async collection => {
    const payload2 = {
      'makes': brand,
      'models': encodeURIComponent(collection),
      'year': '2018',
      'type': 'modelscomm'
    };
    const models = await search(payload2, configuration);

    return {collection, models};
  });

  const results = await pSettle(promises);
  const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);
  const fullfilled = [].concat.apply([], isFulfilled);

  //format the payload to get all fiche-technique link for a given collection and model
  const items = fullfilled.reduce((current, item) => {
    const {collection, models} = item;
    const payloads = models.map(model => {
      return {
        'tag_brand': brand,
        'tag_model': collection,
        'tag_year': '2018',
        'tag_modelcomm': model,
        'bt_modelcomm': 'OK'
      };
    });

    if (payloads.length) {
      current.push(payloads);
    }

    return current;
  }, []);

  return [].concat(...items);
};

/**
 * Get record for a given model
 * @param  {Object}  payload
 * @param  {Object}  configuration
 * @return {Promise}
 */
const getRecord = async (payload, configuration = {}) => {
  const {headers = {}} = configuration;
  const heads = Object.assign({}, HEADERS, {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': url.parse('http://www.caradisiac.com/fiches-techniques/').hostname,
    'Referer': 'http://www.caradisiac.com/fiches-techniques/'
  }, headers);

  const response = await agent.post(Object.assign({}, {'url': 'http://www.caradisiac.com/fiches-techniques/', payload}, configuration), heads);

  if (response && response.redirects) {
    return response.redirects.find(item => item.includes('modele'));
  }

  return null;
};
/**
 * Get all records for a given model
 * @param  {Object}  payloads
 * @param  {Object}  configuration
 * @return {Promise}
 */
const getRecords = async (payloads, configuration) => {
  const promises = payloads.map(async payload => {
    return await getRecord(payload, configuration);
  });

  const results = await pSettle(promises);
  const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);

  return [].concat.apply([], isFulfilled);
};

const getLink = async (brand, action, configuration = {}) => {
  try {
    const {headers = {}} = configuration;
    const heads = Object.assign({}, HEADERS, {
      'Host': url.parse(action).hostname,
      'Referer': action
    }, headers);
    const response = await agent.get(Object.assign({}, {'url': action}, configuration), heads);
    const $ = cheerio.load(response.text);
    const finitions = $('#tableListingVersion a').map((i, element) => {
      return {
        brand,
        'name': $(element).text(),
        'url': `${CARADISIAC}/${$(element).attr('href')}`
      };
    }).get();

    // first with get only link that match the wanted years
    // to avoid old cars models
    const candidates = YEARS
      .map(year => finitions.find(item => item.url.includes(year)))
      .filter(candidate => candidate);

    // get
    return candidates.slice(0, 1);
  } catch (e) {
    return [];
  }
};

const getLinks = async (brand, records, configuration) => {
  const promises = records.map(async record => {
    return await getLink(brand, record, configuration);
  });

  const results = await pSettle(promises);
  const isFulfilled = results
    .filter(result => result.isFulfilled)
    .map(result => result.value)
    .filter(result => result);

  return [].concat.apply([], isFulfilled);
};

module.exports = async (brand, configuration) => {
  try {
    const collections = await getCollections(brand, configuration);
    const payloads = await getPayloads(brand, collections, configuration);
    const records = await getRecords(payloads, configuration);
    const links = await getLinks(brand, records, configuration);

    return links;
  } catch (e) {
    return Promise.reject(e);
  }
};
