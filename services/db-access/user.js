const User = require('../../models/user');

const getById = (id) => User.findById(id);

module.exports = {
  getById,
};
