const cheerio = require('cheerio');
const get = require('./get');
const getRecords = require('../src/get-records');
const pSettle = require('p-settle');

const getSpec = async (brand, record, configuration) => {
  try {
    const response = await get(Object.assign({}, {'action': record.url}, configuration));
    const $ = cheerio.load(response.text);

    const volume = $('.caract02').text().split('/').map(item => item.replace(/\D/g, ''));

    return {
      brand,
      volume,
      'name': record.name
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

    return [].concat.apply([], isFulfilled);
  } catch (e) {
    return Promise.reject(e);
  }
};
