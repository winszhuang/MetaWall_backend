var express = require('express');
var router = express.Router();

// http://127.0.0.1:3000/users
// http://127.0.0.1:3000/users/login
/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.status(200).json({
    "name":"洧杰"
  })
});
// /users/login 1
//  /login 2
router.get('/login', function(req, res, next) {
  // res.send('respond with a resource');
  res.status(200).json({
    "name":"login"
  })
});

module.exports = router;