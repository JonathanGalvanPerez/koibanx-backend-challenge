const Commerce = require('../../models/store');
const commerceSeed = require('./storeSeed.json');

exports.seedStore = async () => {
  Commerce.create(commerceSeed);
};