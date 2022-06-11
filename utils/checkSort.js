const OrderByValue = require('../constants/enum/orderByValue');

function checkValueCanSort(value) {
  if (!value) return false;
  return OrderByValue.includes(value.toString());
}

module.exports = checkValueCanSort;
