const router = require('../utils/routerWrapper')();

const {
  signIn,
  signUp,
} = require('../controller/auth');

router.post('/signin', signIn);
router.post('/signup', signUp);

module.exports = router.instance;
