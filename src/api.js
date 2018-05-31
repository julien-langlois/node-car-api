const agent = require('xcii-agent');
const {CAR_DYNAMIC_API} = require('./constants');
const url = require('url');
const {ua} = require('xcii-agent');

const HEADERS = {
  'Accept-Language': 'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4,de;q=0.2',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'User-Agent': ua,
  'Pragma': 'no-cache',
  'upgrade-insecure-requests': 1
};

/*const heads = Object.assign({}, HEADERS, {
  'Host': url.parse(action).hostname,
  'Referer': action
}, headers);*/

/**
 * Parse response to get brands
 * @param  {String} body
 * @return {Array}
 */
const parse = response => {
  try {
    const text = JSON.parse(response.text);

    return text.hits && text.hits.content || [];
  } catch (e) {
    return [];
  }
};

module.exports.search = async (payload, configuration = {}) => {
  try {
    const action = configuration.action || CAR_DYNAMIC_API;
    const heads = Object.assign({}, HEADERS, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Host': url.parse(action).hostname,
      'Referer': action
    });
    const response = await agent.post(Object.assign({}, {payload, 'url': action}, configuration), heads);
    const data = parse(response);

    if (data) {
      return data;
    }

    return Promise.reject('NOT_AVAILABLE');
  } catch (e) {
    return Promise.reject(e);
  }
};
