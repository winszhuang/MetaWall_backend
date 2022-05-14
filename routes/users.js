const User = require('../models/user');
const router = require('../utils/routerWrapper')();
const successHandler = require('../utils/successHandler');
const appError = require('../utils/appError');

// 這邊的api不會給前台用到，是當初我創假帳號方便用的~
// 考慮後續有機會可以再生一個後臺，屆時可能就需要了~
router.get('/', async (req, res) => {
  const users = await User.find();

  successHandler(res, 200, users);
});

router.post('/', async (req, res, next) => {
  const {
    name, email, password, gender, avator,
  } = req.body;

  // 基本擋，先不要care這邊的驗證，很陽春XD
  if (!name || !email || !password || !gender || !avator) {
    appError(400, '請輸入必填欄位', next);
    return;
  }

  await User.create({
    ...req.body,
    createdAt: Date.now(),
  });

  successHandler(res, 200, true);
});

module.exports = router.instance;
