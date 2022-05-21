const router = require('../utils/routerWrapper')();

const {
  getManyPost,
  addPost,
  editPost,
  deletePost,
  deleteManyPost,
} = require('../controller/post');

router.get('/', getManyPost);
router.post('/', addPost);
router.patch('/:id', editPost);
router.delete('/:id', deletePost);
router.delete('/', deleteManyPost);

module.exports = router.instance;
