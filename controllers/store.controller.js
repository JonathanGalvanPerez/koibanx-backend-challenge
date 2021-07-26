const Commerce = require('../models/store');
const logger = require('../utils/logger');
const storeDataFormatter = require('../utils/storeDataFormatter');

async function getCommerceData(q, sort, page = 1, limit = 10) {
  let query = Commerce.find(q);
  if(sort)
    query = query.sort(sort);
  query = query.skip((page-1)*limit).limit(limit);
  return await query;
}

exports.getCommerces = async (req, res) => {
  try {
    logger.info('GET request received: \n', decodeURI(req.originalUrl));
    const {q, sort, page, limit} = req.query;
    const getFormattedData = storeDataFormatter(getCommerceData);
    res.status(200).json(await getFormattedData(q, sort, page, limit));
  } catch(error) {
    logger.error(error);
    res.status(500).send({ error: 'Server error' });
  }
};

exports.createCommerce = async (req, res) => {
  try {
    logger.info('POST request received: \n', JSON.stringify(req.body));
    const commerce = await Commerce.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Created successfully',
      data: commerce
    });
  } catch(error) {
    logger.error(error);
    res.status(500).send({ error: 'Server error' });
  }
};