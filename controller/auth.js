const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const successHandler = require('../utils/successHandler');
const appError = require('../utils/appError');
const { generateJWT } = require('../utils/jwt');

async function signUp(req, res, next) {
  const { name, email, password } = req.body;
  if (!email || !password || !name) return appError(400, '請完整輸入欄位', next);

  if (!validator.isLength(name, { min: 2 })) return appError(400, '暱稱需大於2字元', next);

  if (!validator.isEmail(email)) return appError(400, 'email格式錯誤', next);

  if (!password.match(/^(?=.*[\u4E00-\u9FA5\s])(?=.*[a-zA-Z])([a-zA-Z|\u4E00-\u9FA5\s]+){8,18}$/)) {
    return appError(400, '密碼至少需 8 碼以上，並中英混合', next);
  }

  const isUserExist = await User.findOne({ email });
  if (isUserExist) return appError(400, '帳號已被註冊，請替換新的Email !', next);

  const newPassword = await bcrypt.hash(password, Number(process.env.PASSWORD_SALT));
  await User.create({
    name,
    email,
    password: newPassword,
    gender: 1,
  });

  return successHandler(res, 200, true);
}

async function signIn(req, res, next) {
  const { password, email } = req.body;

  if (!password || !email) return appError(400, '請完整輸入欄位', next);

  const currentUser = await User.findOne({ email }).select('+password');
  if (!currentUser) return appError(400, 'email不存在，請註冊再登入 !', next);

  const isPasswordCorrect = await bcrypt.compare(password, currentUser.password);
  if (!isPasswordCorrect) return appError(400, '密碼錯誤 !', next);

  currentUser.password = '';
  const token = generateJWT(currentUser);

  return successHandler(res, 200, {
    token,
    name: currentUser.name,
  });
}

module.exports = {
  signIn,
  signUp,
};
