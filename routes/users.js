const router = require('../utils/routerWrapper')();
const isAuth = require('../middleware/isAuth');
const UserController = require('../controller/user');
const FollowController = require('../controller/follow');

// only for test
router.get('/', UserController.getManyUser);
router.delete('/', UserController.deleteAllUser);

// 給前台使用者用的
router.get('/profile', isAuth, UserController.getProfile);
router.get('/:userId/profile', isAuth, UserController.getSpecificProfile);
router.patch('/profile', isAuth, UserController.updateProfile);
router.patch('/updatePassword', isAuth, UserController.updatePassword);

// 追蹤相關
router.get('/following', isAuth, FollowController.getFollowingList);
router.get('/followers', isAuth, FollowController.getFollowersList);
router.patch('/:userId/follow', isAuth, FollowController.addFollow);
router.patch('/:userId/unfollow', isAuth, FollowController.unFollow);

module.exports = router.instance;
