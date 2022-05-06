var express = require('express');
var router = express.Router();
const Post = require("../models/post");
router.get('/', async function(req, res, next) {
  const post = await Post.find();
  // res.send('respond with a resource');
  res.status(200).json({
    post
  })
});

router.post('/', async function(req, res, next) {
    // query params
    // console.log(req.body)
    const newPost = await Post.create(req.body);
    // res.send('<h1>1234</h1>');
    res.status(200).json({
      status:"success",
      post: newPost
    })
  });

module.exports = router;