/**
 *
 * @param {Record<string, string|number>} object
 * @param {string[]} keys
 * @param {Function[]|Function|undefined} validations
 * @returns {Record<string, string|number>}
 */
function pickVerified(object, keys, validations) {
  if (!validations) return pick(object, keys);

  const isSingleValidateFunc = typeof validations === 'function';
  if (isSingleValidateFunc) return pickVerifiedWithSingleFunc(object, keys, validations);

  if (Array.isArray(validations)) {
    const isAllFunc = validations.every((validation) => typeof validation === 'function');
    if (!isAllFunc) throw new Error('validations should be multi function in array!!');
    return pickVerifiedWithMultiFunc(object, keys, validations);
  }

  return {};
}

function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

function pickVerifiedWithSingleFunc(object, keys, validations) {
  return keys.reduce((obj, key) => {
    if (!object) return obj;
    if (!Object.prototype.hasOwnProperty.call(object, key)) return obj;
    if (validations(object[key])) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

function pickVerifiedWithMultiFunc(object, keys, validations) {
  return keys.reduce((obj, key, index) => {
    if (!object) return obj;
    if (!Object.prototype.hasOwnProperty.call(object, key)) return obj;
    if (validations[index](object[key])) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

module.exports = pickVerified;
