const OrderByEnum = require('../constants/enum/orderByEnum')

function checkValueCanSort(value) {
  if (value === OrderByEnum.ASC) return true
  if (value === OrderByEnum.DESC) return true
  return false
}

module.exports = checkValueCanSort