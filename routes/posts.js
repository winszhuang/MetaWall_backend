const router = require('../utils/routerWrapper')();

const {
  getManyPost,
  addPost,
} = require('../controller/post');

router.get('/', getManyPost);
router.post('/', addPost);

module.exports = router.instance;
