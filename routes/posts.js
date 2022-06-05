const router = require('../utils/routerWrapper')();
const isAuth = require('../middleware/isAuth');
const PostController = require('../controller/post');
const LikeController = require('../controller/like');
const CommentController = require('../controller/comment');

// comment評論
router.get('/comments', isAuth, CommentController.getAllComment); // 測試用
router.post('/:postId/comment', isAuth, CommentController.addComment);
router.patch('/:postId/comment/:commentId', isAuth, CommentController.editComment);
router.delete('/:postId/comment/:commentId', isAuth, CommentController.deleteComment);

// 一般貼文相關
router.get('/', isAuth, PostController.getManyPost);
router.get('/:id', isAuth, PostController.getPostById);
router.post('/', isAuth, PostController.addPost);
router.patch('/:id', isAuth, PostController.editPost);
router.delete('/:id', isAuth, PostController.deletePost);
router.delete('/', isAuth, PostController.deleteManyPost);

// 按讚
router.patch('/:id/like', isAuth, LikeController.like);
router.patch('/:id/unlike', isAuth, LikeController.unLike);
router.get('/:id/likes', isAuth, LikeController.getLikePost);

module.exports = router.instance;
