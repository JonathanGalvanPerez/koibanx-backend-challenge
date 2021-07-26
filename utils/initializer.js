const User = require('../models/user');
const Store = require('../models/store');
const logger = require('../utils/logger');
const { seedStore } = require('../models/seed/seeders');

exports.init = async function () {
  if (!await User.countDocuments({'username': 'test@koibanx.com'})) {
    let user = new User();
    user.username = 'test@koibanx.com';
    user.password = 'test123';
    await User.create(user);

    logger.info('Test User created');
  }
  else if (process.env.NODE_ENV === 'development' && !await Store.estimatedDocumentCount()) {
    logger.info('Running seeds');
    await seedStore();

    logger.info('Store seed created');
  }
  else
    logger.info('Data already exists. Nothing to do. \n Waiting requests...');
  return;
};
