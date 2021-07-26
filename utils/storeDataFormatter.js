const Commerce = require('../models/store');

const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 0
});

function formatARS(value) {
  return formatter.format(value).replace(',', '.');
}

module.exports = function storeDataFormatter(f) {
  return async function (q, sort, page, limit) {
    let data = await f(q, sort, page, limit);
    data = data.map(element => {
      let newElement = {
        id: element.id,
        name: element.name,
        cuit: element.cuit,
        currentBalance: formatARS(element.currentBalance),
        active: element.active ? 'Si' : 'No',
        lastSale: element.lastSale.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit'})
      };
      element.concepts.forEach((value, index) => {
        newElement['concept' + index] = value;
      });
      return newElement;
    });
    const total = await Commerce.countDocuments(q);
    const pages = Math.ceil(total / limit);
    return {
      data,
      page,
      pages,
      limit,
      total
    };
  };
};