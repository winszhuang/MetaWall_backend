const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { successHandler, errorHandler } = require('../utils/responseHandler');

router.get('/', async function (req, res, next) {
  const users = await User.find();

  successHandler(res, 200, users);
});

router.post('/', async function (req, res, next) {
  try {
    await User.create({
      ...req.body,
      "createdAt": Date.now()
    })

    successHandler(res, 200, true);
  } catch (error) {
    errorHandler(res, 400, error);
  }
});

module.exports = router;