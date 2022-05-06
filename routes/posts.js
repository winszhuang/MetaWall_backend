const express = require('express');
const router = express.Router();

const {
  getManyPost,
  addPost
} = require('../controller/post');

router.get('/', getManyPost);
router.post('/',addPost);

module.exports = router;