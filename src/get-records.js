const api = require('./api');
const cheerio = require('cheerio');
const {CARADISIAC} = require('./constants');
const get = require('./get');
const pSettle = require('p-settle');
const post = require('./post');

const getCollections = async (brand, configuration) => {
  const payload = {
    'makes': brand,
    'models': 0,
    'year': 0,
    'type': 'models'
  };

  return await api(payload, configuration);
};

const getPayloads = async (brand, collections, configuration) => {
  const promises = collections.map(async collection => {
    const payload2 = {
      'makes': brand,
      'models': collection,
      'year': '2018',
      'type': 'modelscomm'
    };
    const models = await api(payload2, configuration);

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

const getRecord = async (payload, configuration) => {
  const response = await post(Object.assign({}, {'action': 'http://www.caradisiac.com/fiches-techniques/', payload}, configuration));

  if (response && response.redirects) {
    return response.redirects[0];
  }

  return null;
};

const getRecords = async (payloads, configuration) => {
  const promises = payloads.map(async payload => {
    return await getRecord(payload, configuration);
  });

  const results = await pSettle(promises);
  const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);

  return [].concat.apply([], isFulfilled);
};

const getLink = async (brand, action, configuration) => {
  try {
    const response = await get(Object.assign({}, {action}, configuration));
    const $ = cheerio.load(response.text);

    return $('#tableListingVersion a').map((i, element) => {
      return {
        brand,
        'name': $(element).text(),
        'url': `${CARADISIAC}/${$(element).attr('href')}`
      };
    }).get();
  } catch (e) {
    return [];
  }
};

const getLinks = async (brand, records, configuration) => {
  const promises = records.map(async record => {
    return await getLink(brand, record, configuration);
  });

  const results = await pSettle(promises);
  const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);

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
