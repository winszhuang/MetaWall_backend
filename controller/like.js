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

  successHandler(res, 200, posts);
}

async function like(req, res, next) {
  const { postId } = req.params;

  const filter = {
    _id: postId,
    likes: { $nin: req.user._id },
  };

  const updatePost = await Post.findOneAndUpdate(filter, {
    $push: {
      likes: req.user._id,
    },
  }, { new: true });

  if (!updatePost) {
    return appError(404, '按讚錯誤', next);
  }

  return successHandler(res, '成功更新讚數', updatePost);
}

async function unLike(req, res, next) {
  const { postId } = req.params;

  const filter = {
    _id: postId,
    likes: { $in: req.user._id },
  };

  const updatePost = await Post.findOneAndUpdate(filter, {
    $pull: {
      likes: req.user._id,
    },
  }, { new: true });

  if (!updatePost) {
    return appError(404, '取消讚錯誤', next);
  }

  return successHandler(res, '成功移除按讚', updatePost);
}

module.exports = {
  getLikePost,
  like,
  unLike,
};
