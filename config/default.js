const development_config = {
  'port': 3000,
  'mongodb': {
    'username': process.env.DATABASE_USERNAME,
    'password': process.env.DATABASE_PASSWORD,
    'host': process.env.DATABASE_HOST,
    'port': process.env.DATABASE_PORT,
    'dbname': process.env.DATABASE_DBNAME,
    'address': process.env.DATABASE_HOST + ':' + process.env.DATABASE_PORT
  },
};

const test_config = {
  'port': 3000,
  'mongodb': {
    'username': process.env.DATABASE_USERNAME,
    'password': process.env.DATABASE_PASSWORD,
    'host': process.env.DATABASE_HOST,
    'port': process.env.DATABASE_PORT,
    'dbname': process.env.TEST_DATABASE_DBNAME,
    'address': process.env.DATABASE_HOST + ':' + process.env.DATABASE_PORT
  },
};

module.exports = process.env.NODE_ENV === 'test' ? test_config : development_config;