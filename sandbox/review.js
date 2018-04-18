const getReview = require('../src/get-review');

async function sandbox () {
  const review = await getReview('modele--peugeot-2008');

  console.log(review);
}

sandbox();
