const getGallery = require('./get-gallery');

module.exports = async (brand, configuration) => {
  const gallery = await getGallery(brand, configuration);

  console.log(gallery);
};
