const getModels = require('../src/get-models');

async function sandbox () {
  const models = await getModels('PEUGEOT');

  console.log(models);
}

sandbox();
