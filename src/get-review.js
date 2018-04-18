const cheerio = require('cheerio');
const {get} = require('./api');

//http://www.caradisiac.com/modele--peugeot-2008/avis

module.exports = async (model, configuration = {}) => {
  try {
    const action = `http://www.caradisiac.com/${model}/avis`;
    const response = await get(Object.assign({}, {action}, configuration));
    const $ = cheerio.load(response.text);
    const rating = parseFloat($('div [itemprop="aggregateRating"] span[itemprop="ratingValue"]').text());
    const worst = parseFloat($('div [itemprop="aggregateRating"] meta[itemprop="worstRating"]').attr('content'));
    const best = parseFloat($('div [itemprop="aggregateRating"] meta[itemprop="bestRating"]').attr('content'));
    const count = parseInt(parseFloat($('div [itemprop="aggregateRating"] meta[itemprop="reviewCount"]').attr('content')), 10);

    return {
      best,
      count,
      worst,
      rating
    };
  } catch (e) {
    console.log(e);
    return {};
  }
};
