const Post = require('../models/post');
const successHandler = require('../utils/successHandler');
const currentUserId = require('../common/tempUserId');
const checkValueCanSort = require('../utils/checkSort');
const appError = require('../utils/appError');

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
  const { content, image } = req.body;

  if (!content) return appError('404', 'require content', next);

  return Post.create({
    content,
    image,
    author: currentUserId,
  });
}

module.exports = {
  getManyPost,
  addPost,
};
