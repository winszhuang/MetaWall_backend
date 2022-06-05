const Post = require('../models/post');
const Comment = require('../models/comment');
const appError = require('../utils/appError');
const successHandler = require('../utils/successHandler');
const { getFileInfo } = require('../store/s3');

async function addComment(req, res, next) {
  const { postId } = req.params;
  const { content, image } = req.body;

  if (!content) {
    return appError(404, '請輸入評論內容', next);
  }

  const currentPost = await Post.findById(postId);
  if (!currentPost) return appError(400, '不存在的貼文', next);

  if (!image) {
    const newComment = await Comment.create({
      user: req.user._id,
      content,
      post: postId,
    });

    return successHandler(res, '成功上傳留言', newComment);
  }

  await getFileInfo(image);
  const newComment = await Comment.create({
    user: req.user._id,
    content,
    image,
    post: postId,
  });

  return successHandler(res, '成功上傳留言', newComment);
}

async function editComment(req, res, next) {
  const { content, image } = req.body;
  const { commentId } = req.params;

  if (!content) {
    return appError(400, '留言內容不可為空', next);
  }

  const currentComment = await Comment.findById(commentId);
  if (currentComment.user._id.toString() !== req.user._id) {
    return appError(400, '只有本人可以編輯自己的留言', next);
  }

  if (!image) {
    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content,
        updatedAt: Date.now(),
      },
      {
        new: true,
      },
    );
    if (!updateComment) {
      return appError(400, '編輯評論失敗', next);
    }
    return successHandler(res, '編輯評論成功', next);
  }

  await getFileInfo(image);
  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
      image,
      updatedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  if (!updateComment) {
    return appError(400, '編輯評論失敗', next);
  }
  return successHandler(res, '編輯評論成功', next);
}

async function deleteComment(req, res, next) {
  const { commentId } = req.params;

  const currentComment = await Comment.findById(commentId);
  if (currentComment.user._id.toString() !== req.user._id) {
    return appError(400, '只有本人可以刪除自己的留言', next);
  }

  const result = await Comment.findByIdAndDelete(commentId);
  return successHandler(res, '刪除成功', result);
}

// 測試用
async function getAllComment(req, res) {
  const comment = await Comment.find();
  successHandler(res, 'success', comment);
}

module.exports = {
  addComment,
  editComment,
  deleteComment,
  getAllComment,
};
