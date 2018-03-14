const {CARADISIAC, CAR_CONSTRUCTOR} = require('./constants');
const cheerio = require('cheerio');
const get = require('./get');

const format = href => {
  return href.includes('modeles') ? href : `${href}modeles`;
};

/**
 * Parse response to get brands
 * @param  {String} body
 * @return {Array}
 */
const parse = body => {
  const $ = cheerio.load(body);

  return $('.constructeurListVisuels li > a').map((i, element) => {
    return {
      'name': $(element).attr('title'),
      'url': `${CARADISIAC}/${format($(element).attr('href'))}`
    };
  }).get();
};

module.exports = async configuration => {
  try {
    const text = await get(CAR_CONSTRUCTOR, configuration);

    if (text) {
      return parse(text);
    }

    return Promise.reject('NOT_AVAILABLE');
  } catch (e) {
    return Promise.reject(e);
  }
};
