const {ua} = require('xcii-agent');

module.exports = {
  'CARADISIAC': 'http://www.caradisiac.com',
  'CAR_DYNAMIC_API': 'http://www.caradisiac.com/js-dynamic/search_fiches_tech.php',
  'CAR_RECORDS_API': 'http://www.caradisiac.com/fiches-techniques/',
  'YEARS': ['2018', '2017', '2016'],
  'HEADERS': {
    'Accept-Language': 'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4,de;q=0.2',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'User-Agent': ua,
    'Pragma': 'no-cache',
    'upgrade-insecure-requests': 1
  }
};
