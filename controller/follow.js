const appError = require('../utils/appError');
const successHandler = require('../utils/successHandler');
const { FollowService, UserService } = require('../services/db-access');

/**
 * 取得當前使用者正在追蹤的人的列表
 */
async function getFollowingList(req, res) {
  const followingList = await FollowService.getFollowingByUserId(req.user._id);

  return successHandler(res, '成功', followingList);
}

/**
 * 取得哪些人正在追蹤當前使用者
 */
async function getFollowersList(req, res) {
  const followersList = await FollowService.getFollowersByUserId(req.user._id);

  return successHandler(res, '成功', followersList);
}

async function addFollow(req, res, next) {
  const { userId } = req.params;

  if (userId === req.user._id) {
    return appError(400, '無法追蹤自己', next);
  }

  const beFollowUser = await UserService.getById(userId);
  if (!beFollowUser) {
    return appError(400, '無此使用者可追蹤', next);
  }

  const isSuccess = await FollowService.follow(req.user._id, userId);
  return isSuccess
    ? successHandler(res, '成功追蹤', true)
    : appError(400, '追蹤錯誤', next);
}

async function unFollow(req, res, next) {
  const { userId } = req.params;

  if (userId === req.user._id) {
    return appError(400, '無法追蹤自己', next);
  }

  const beFollowUser = await UserService.getById(userId);
  if (!beFollowUser) {
    return appError(400, '無此使用者可追蹤', next);
  }

  const isSuccess = await FollowService.unFollow(req.user._id, userId);
  return isSuccess
    ? successHandler(res, '成功取消追蹤', true)
    : appError(400, '取消追蹤錯誤', next);
}

module.exports = {
  addFollow,
  unFollow,
  getFollowingList,
  getFollowersList,
};
