const router = require('../utils/routerWrapper')();
const isAuth = require('../middleware/isAuth');

const {
  getManyPost,
  addPost,
  editPost,
  deletePost,
  deleteManyPost,
} = require('../controller/post');

router.get('/', isAuth, getManyPost);
router.post('/', isAuth, addPost);
router.patch('/:id', isAuth, editPost);
router.delete('/:id', isAuth, deletePost);
router.delete('/', isAuth, deleteManyPost);

module.exports = router.instance;
