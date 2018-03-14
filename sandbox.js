const {getBrands, getRecords} = require('./');

async function brandsSandbox () {
  const brands = await getBrands();

  console.log(brands);
}

async function recordsSandbox () {
  const records = await getRecords({ name: 'Audi',
    url: 'http://www.caradisiac.com//auto--audi/modeles' },);
}

//brandsSandbox();

recordsSandbox();
