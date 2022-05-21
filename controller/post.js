const Post = require('../models/post');
const successHandler = require('../utils/successHandler');
const currentUserId = require('../common/tempUserId');
const checkValueCanSort = require('../utils/checkSort');
const appError = require('../utils/appError');
const { getFileInfo } = require('../store/s3');

async function getManyPost(req, res) {
  // 除了q傳遞搜尋字串之外，其他值皆屬排序，皆只能傳遞1或者-1來遞升或遞減
  const { q, likesSort, dateSort } = req.query;

  const filterByQuery = {};
  const filterBySort = {};

  if (q) {
    const regex = new RegExp(`${q}`, 'i');
    filterByQuery.content = regex;
  }

  if (dateSort && checkValueCanSort(dateSort)) {
    filterBySort.createdAt = dateSort;
  }

  if (likesSort && checkValueCanSort(likesSort)) {
    filterBySort.likes = likesSort;
  }

  // 如果排序相關沒有任何query，就給預設由新到舊排序
  const defaultFilterOrNot = Object.keys(filterBySort).length === 0
    ? { createdAt: '-1' }
    : filterBySort;

  const posts = await Post.find(filterByQuery)
    .sort(defaultFilterOrNot)
    .populate({
      path: 'author',
      select: 'name avator createdAt',
    });

  successHandler(res, 200, posts);
}

async function addPost(req, res, next) {
  // image是傳id值
  const { content, image } = req.body;

  if (!content) return appError('404', 'require content', next);

  if (!image) {
    const result = Post.create({
      content,
      author: currentUserId,
    });
    return successHandler(res, 200, result);
  }

  // 如果沒有該imageId，就直接在這裡出錯，並被handleErrorAsync接住
  // 不需要再此處判斷是否有值
  await getFileInfo(image);

  const result = Post.create({
    content,
    image,
    author: currentUserId,
  });
  return successHandler(res, 200, result);
}

async function editPost(req, res, next) {
  const { content, image } = req.body;

  if (!content) return appError(404, 'content required', next);
  if (!image) {
    const updatePost = await Post.findByIdAndUpdate(req.params.id, {
      content,
    }, { new: true });
    return successHandler(res, 200, updatePost);
  }

  // 如果沒有該imageId，就直接在這裡出錯，並被handleErrorAsync接住
  // 不需要再此處判斷是否有值
  await getFileInfo(image);

  const updatePost = await Post.findByIdAndUpdate(req.params.id, {
    content,
    image,
  }, { new: true });

  return successHandler(res, 200, updatePost);
}

async function deletePost(req, res) {
  const oldPost = await Post.findByIdAndDelete(req.params.id);
  return successHandler(res, 200, oldPost);
}

// 刪除所有貼文(測試用)
async function deleteManyPost(req, res) {
  const result = await Post.deleteMany();
  return successHandler(res, 200, result);
}

module.exports = {
  getManyPost,
  addPost,
  editPost,
  deletePost,
  deleteManyPost,
};
