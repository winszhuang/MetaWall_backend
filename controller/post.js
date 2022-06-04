const Post = require('../models/post');
const successHandler = require('../utils/successHandler');
const checkValueCanSort = require('../utils/checkSort');
const appError = require('../utils/appError');
const { getFileInfo } = require('../store/s3');
const parsePaginationInfo = require('../services/pagination/parsePaginationInfo');

/** 預設排序方式 */
const DEFAULT_SORT = 'desc';

async function getManyPost(req, res) {
  const {
    q,
    likes,
    comments,
    createdAt = DEFAULT_SORT,
  } = req.query;

  const { skip, limit } = parsePaginationInfo(req);

  const filterByQuery = q ? { content: new RegExp(`${q}`, 'i') } : {};
  const filterBySort = {};

  if (checkValueCanSort(likes)) filterBySort.likes = likes;
  if (checkValueCanSort(comments)) filterBySort.comments = comments;
  if (checkValueCanSort(createdAt)) filterBySort.createdAt = createdAt;

  const posts = await Post.find(filterByQuery)
    .populate({
      path: 'user',
      select: 'name avatar',
    })
    .populate({
      path: 'likes',
      select: '_id name avatar',
    })
    .sort(filterBySort)
    .skip(skip)
    .limit(limit);

  successHandler(res, '取得貼文成功', posts);
}

async function getPostById(req, res, next) {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) return appError(404, 'invalid id', next);

  return successHandler(res, '取得貼文成功', post);
}

async function addPost(req, res, next) {
  // image是傳id值
  const { content, image } = req.body;

  if (!content) return appError('400', 'require content', next);

  if (!image) {
    const result = await Post.create({
      content,
      user: req.user._id,
    });

    return successHandler(res, '新增貼文成功', result);
  }

  // 如果沒有該imageId，就直接在這裡出錯，並被handleErrorAsync接住
  // 不需要再此處判斷是否有值
  await getFileInfo(image);

  const result = await Post.create({
    content,
    image,
    user: req.user._id,
  });
  return successHandler(res, '新增貼文成功', result);
}

async function editPost(req, res, next) {
  const { content, image } = req.body;

  if (!content) return appError(400, 'content required', next);

  if (!image) {
    const updatePost = await Post.findByIdAndUpdate(req.params.id, {
      content,
    }, { new: true });

    return updatePost
      ? successHandler(res, '編輯貼文成功', updatePost)
      : appError(400, 'invalid id', next);
  }

  // 如果沒有該imageId，就直接在這裡出錯，並被handleErrorAsync接住
  // 不需要再此處判斷是否有值
  await getFileInfo(image);

  const updatePost = await Post.findByIdAndUpdate(req.params.id, {
    content,
    image,
  }, { new: true });

  return updatePost
    ? successHandler(res, '編輯貼文成功', updatePost)
    : appError(400, 'invalid id', next);
}

async function deletePost(req, res, next) {
  const oldPost = await Post.findByIdAndDelete(req.params.id);

  return oldPost
    ? successHandler(res, '刪除貼文成功', oldPost)
    : appError(400, 'invalid id', next);
}

// 刪除所有貼文(測試用)
async function deleteManyPost(req, res) {
  const result = await Post.deleteMany();
  return successHandler(res, '刪除貼文成功', result);
}

module.exports = {
  getManyPost,
  getPostById,
  addPost,
  editPost,
  deletePost,
  deleteManyPost,
};
