const router = require('../utils/routerWrapper')();
const isAuth = require('../middleware/isAuth');
const UserController = require('../controller/user');

// only for test
router.get('/', UserController.getManyUser);
router.delete('/', UserController.deleteAllUser);

// 給前台使用者用的
router.get('/profile', isAuth, UserController.getProfile);
router.patch('/profile', isAuth, UserController.updateProfile);
router.patch('/updatePassword', isAuth, UserController.updatePassword);

module.exports = router.instance;
