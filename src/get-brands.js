const {CAR_API} = require('./constants');
const post = require('./post');

/**
 * Parse response to get brands
 * @param  {String} body
 * @return {Array}
 */
const parse = body => {
  try {
    const response = JSON.parse(body);

    return response.hits && response.hits.content || [];
  } catch (e) {
    return [];
  }
};

module.exports = async configuration => {
  try {
    const payload = {'type': 'brands'};
    const text = await post(Object.assign({}, {'action': CAR_API, payload}, configuration));

    if (text) {
      return parse(text);
    }

    return Promise.reject('NOT_AVAILABLE');
  } catch (e) {
    return Promise.reject(e);
  }
};
