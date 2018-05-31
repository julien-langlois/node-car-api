const agent = require('xcii-agent');
const cheerio = require('cheerio');
const getRecords = require('../src/get-records');
const getReview = require('../src/get-review');
const pSettle = require('p-settle');
const uuidv5 = require('uuid/v5');

/**
 * Get the tc_vars
 * @param  {String} body
 * @return {Object}
 */
 /*eslint-disable camelcase*/
const getTcVars = body => {
  const $ = cheerio.load(body, {
    'normalizeWhitespace': false,
    'xmlMode': false,
    'decodeEntities': true
  });
  let tc_vars = null;

  $('script').each(function each () {
    const text = $(this).html().toString();

    if (text.includes('tc_vars')) {
      try {
        // the json is not valid, we have to
        //1. replace all ' with "
        //2 .add "" for some values
        //3. remove last comma
        const item = agent.find('var tc_vars =', text)
          .replace(/'/g, '"')
          .replace(/: ([^"]*),/g, ':\"$1\",')
          .replace(/,(?=[^,]*$)/, '');

        tc_vars = JSON.parse(item);

        return;
      } catch (e) {
        console.error(e);
        return;
      }
    }
  });

  return tc_vars;
};
/*eslint-enable camelcase*/

/**
 * Get required specification
 * @param  {String}  brand
 * @param  {Object}  record
 * @param  {Object}  configuration
 * @return {Promise}
 */
const getSpec = async (brand, record, configuration = {}) => {
  try {
    const url = record.url;
    const response = await agent.get(Object.assign({}, {url}, configuration));
    const $ = cheerio.load(response.text);

    const model = $('.ttlNav a > span').text();
    const [volume] = $('.caract02').text().split('/').map(item => parseInt(item.replace(/\D/g, ''), 10));
    const image = $('.ficheTech img.img-responsive').attr('src');
    const description = getTcVars(response.text);
    const slug = $('ul.navItem > li.first a').attr('href');
    const review = await getReview(slug);

    return {
      brand,
      description,
      image,
      model,
      review,
      url,
      volume,
      'name': record.name,
      'uuid': uuidv5(url, uuidv5.URL)
    };
  } catch (e) {
    return [];
  }
};

module.exports = async (brand, configuration) => {
  try {
    const records = await getRecords(brand, configuration);
    const promises = records.map(async record => {
      return await getSpec(brand, record, configuration);
    });

    const results = await pSettle(promises);
    const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);

    console.log(isFulfilled.length);
    console.log(records.length);

    return [].concat.apply([], isFulfilled);
  } catch (e) {
    return Promise.reject(e);
  }
};
