const express = require('express');
const { getCommerces, createCommerce } = require('../controllers/store.controller');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.get('/stores', authenticate, validate.getCommerces, getCommerces);
router.post('/stores', authenticate, validate.postCommerce, createCommerce);

module.exports = router;
