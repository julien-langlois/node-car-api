const {search} = require('./api');

/**
 * Get list of brands
 * @param  {Object}
 * @return {Promise}
 */
module.exports = async configuration => {
  try {
    const payload = {'type': 'brands'};
    const brands = await search(payload, configuration);

    if (brands.length) {
      return brands;
    }

    return Promise.reject('NOT_AVAILABLE');
  } catch (e) {
    return Promise.reject(e);
  }
};
