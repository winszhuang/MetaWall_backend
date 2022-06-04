const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');
const appError = require('../utils/appError');
const successHandler = require('../utils/successHandler');
const GenderEnum = require('../constants/enum/genderEnum');
const { getFileInfo } = require('../store/s3');

async function getManyUser(req, res) {
  const users = await User.find();

  successHandler(res, '取得所有使用者成功', users);
}

async function updatePassword(req, res, next) {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) return appError(400, '欄位必填', next);

  if (password !== confirmPassword) return appError(400, '密碼確認錯誤', next);

  if (!password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
    return appError(400, '密碼必須英數混合', next);
  }

  const newPassword = await bcrypt.hash(password, Number(process.env.PASSWORD_SALT));

  const result = await User.findByIdAndUpdate(req.user._id, {
    password: newPassword,
  });

  return successHandler(res, '更新密碼成功', result);
}

async function getProfile(req, res) {
  const userInfo = await User.findById(req.user._id);
  successHandler(res, '取得使用者資訊成功', userInfo);
}

async function updateProfile(req, res, next) {
  const { avatar, name, gender } = req.body;

  if (name && !validator.isLength(name, { min: 2 })) return appError(400, '暱稱需大於2字元', next);

  if (gender && gender.toString() !== GenderEnum.Male && gender.toString() !== GenderEnum.Female) {
    return appError(400, '性別欄位非正確值', next);
  }

  // 沒有頭像就直接上傳了，避免向S3要資料耗時間
  if (!avatar) {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name,
      gender,
    }, { new: true });
    return successHandler(res, '更新使用者資訊成功', user);
  }

  const isImageInS3 = await getFileInfo(avatar);
  if (!isImageInS3) return appError(400, '圖片上傳錯誤', next);

  const user = await User.findByIdAndUpdate(req.user._id, {
    avatar,
    name,
    gender,
  }, { new: true });

  return successHandler(res, '更新使用者資訊成功', user);
}

module.exports = {
  getManyUser,
  updatePassword,
  getProfile,
  updateProfile,
};
