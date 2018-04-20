const getRecords = require('../src/get-records');

async function sandbox () {
  const records = await getRecords('CITROEN');

  console.log(records);
}

sandbox();
