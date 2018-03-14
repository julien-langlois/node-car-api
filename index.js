module.exports.getBrands = require('./src/get-brands');
module.exports.getModels = require('./src/get-models');


const myCar = {
  'volume': 500,
  'name': '508'
};


const {name, volume} = myCar;

const name = myCar.name;



module.exports = {
  'getBrands': require('./src/get-brands'),
  'getModels': require('./src/get-models')
};


const {getBrands} = require();

require('node-car-api/src/get-records');
