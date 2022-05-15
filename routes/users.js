const router = require('../utils/routerWrapper')();
const isAuth = require('../middleware/isAuth');
const {
  getManyUser,
  updatePassword,
  getProfile,
  updateProfile,
} = require('../controller/user');

// 這邊的api不會給前台用到，是當初我創假帳號方便用的~
// 考慮後續有機會可以再生一個後臺，屆時可能就需要了~
router.get('/', getManyUser);

// 給前台使用者用的
router.post('/updatePassword', isAuth, updatePassword);
router.get('/profile', isAuth, getProfile);
router.patch('/profile', isAuth, updateProfile);

module.exports = router.instance;
