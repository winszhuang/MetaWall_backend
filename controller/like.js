const Post = require('../models/post');
const successHandler = require('../utils/successHandler');
const appError = require('../utils/appError');
const parsePaginationInfo = require('../services/pagination/parsePaginationInfo');

async function getLikePost(req, res) {
  const { skip, limit } = parsePaginationInfo(req);

  const posts = await Post.find({
    likes: {
      $in: req.user._id,
    },
  })
    .populate({
      path: 'user',
      select: 'name photo',
    })
    .select('-comments -likes')
    .sort({ createdAt: 'desc' })
    .skip(skip)
    .limit(limit);

  successHandler(res, '成功取得按讚的貼文!!', posts);
}

async function like(req, res, next) {
  const { id } = req.params;

  const updatePost = await Post.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
  );

  if (!updatePost) {
    return appError(404, '按讚錯誤', next);
  }

  return successHandler(res, '成功更新讚數', true);
}

async function unLike(req, res, next) {
  const { id } = req.params;

  const updatePost = await Post.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $pull: {
        likes: req.user._id,
      },
    },
  );

  if (!updatePost) {
    return appError(404, '取消讚錯誤', next);
  }

  return successHandler(res, '成功移除按讚', true);
}

module.exports = {
  getLikePost,
  like,
  unLike,
};
