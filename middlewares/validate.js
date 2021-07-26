const { validationResult, checkSchema } = require('express-validator');
const logger = require('../utils/logger');

exports.getCommerces = [
  checkSchema(
    {
      page: {
        notEmpty: {
          errorMessage: 'Parámetro page es requerido',
        },
        isInt: {
          errorMessage: 'Parámetro page debe ser un numero',
        },
        toInt: true
      },
      limit: {
        notEmpty: {
          errorMessage: 'Parámetro limit es requerido',
        },
        isInt: {
          errorMessage: 'Parámetro limit debe ser un numero',
        },
        toInt: true
      },
      sort: {
        isIn: {
          options: [['id', 'cuit']],
          errorMessage: 'Parámetro sort debe tener valor cuit o id',
        },
      },
      q: {
        optional: true,
        isJSON: {
          errorMessage: 'Parámetro q debe ser un JSON valido',
        },
        customSanitizer: {
          options: (value) => JSON.parse(value),
        },
      },
      'q.active': {
        optional: true,
        isBoolean: {
          errorMessage: 'filtro active debe ser booleano',
        },
      },
      'q.$or': {
        optional: true,
        isArray: {
          options: {
            min: 2,
          },
          errorMessage:
            '$or debe ser un array y debe tener al menos dos elementos',
        },
      },
      'q.$and': {
        optional: true,
        isArray: {
          options: {
            min: 2,
          },
          errorMessage:
            '$and debe ser un array y debe tener al menos dos elementos',
        },
      },
      'q.$and.*': {
        optional: true,
        isObject: true,
        errorMessage: '$and debe ser un array de objetos',
      },
      'q.$or.*': {
        optional: true,
        isObject: true,
        errorMessage: '$or debe ser un array de objetos',
      },
      'q.$*.*.active': {
        optional: true,
        isBoolean: {
          errorMessage: 'filtro active debe ser booleano',
        },
      }
    },
    ['query']
  ),
  validationResponse
];

exports.postCommerce = [
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: 'Parámetro name es requerido',
        },
        isString: {
          errorMessage: 'Parámetro name debe ser un string',
        },
      },
      cuit: {
        notEmpty: {
          errorMessage: 'Parámetro cuit es requerido',
        },
        isString: {
          errorMessage: 'Parámetro cuit debe ser un string',
        },
      },
      concepts: {
        isArray: {
          min: 6,
        },
        errorMessage:
          'Paramatro concepts debe ser un array y debe tener al menos 6 elementos',
      },
      currentBalance: {
        notEmpty: {
          errorMessage: 'Parámetro currentBalance es requerido',
        },
        isInt: {
          errorMessage: 'Parámetro currentBalance debe ser un int',
        },
      },
      active: {
        notEmpty: {
          errorMessage: 'Parámetro active es requerido',
        },
        isBoolean: {
          errorMessage: 'Parámetro active de ser un booleano',
        },
        toBoolean: true
      },
      lastSale: {
        notEmpty: {
          errorMessage: 'Parámetro lastSale es requerido',
        },
        isDate: {
          errorMessage: 'Parámetro lastSale debe ser de tipo Date',
        },
        toDate: true
      },
    },
    ['body']
  ),
  validationResponse
];

function validationResponse(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  logger.info('Validations successful.');
  return next();
}