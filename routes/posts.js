const router = require('../utils/routerWrapper')();
const isAuth = require('../middleware/isAuth');
const PostController = require('../controller/post');
const LikeController = require('../controller/like');

router.get('/', isAuth, PostController.getManyPost);
router.get('/:id', isAuth, PostController.getPostById);
router.post('/', isAuth, PostController.addPost);
router.patch('/:id', isAuth, PostController.editPost);
router.delete('/:id', isAuth, PostController.deletePost);
router.delete('/', isAuth, PostController.deleteManyPost);

router.patch('/:id/like', isAuth, LikeController.like);
router.patch('/:id/unlike', isAuth, LikeController.unLike);
router.get('/:id/likes', isAuth, LikeController.getLikePost);

module.exports = router.instance;
