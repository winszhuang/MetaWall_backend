const successHandler = require('../utils/successHandler');
const appError = require('../utils/appError');
const { getFileInfo } = require('../store/s3');
const { PostService, UserService } = require('../services/db-access');

async function getManyPost(req, res) {
  const posts = await PostService.findByReq(req);

  successHandler(res, '取得貼文成功', posts);
}

async function getPostById(req, res, next) {
  const { id } = req.params;

  const post = await PostService.getById(id);
  if (!post) return appError(404, 'invalid id', next);

  return successHandler(res, '取得貼文成功', post);
}

async function getUserPosts(req, res, next) {
  const { userId } = req.params;

  if (!userId) {
    return appError(400, '無此使用者', next);
  }

  if (userId === 'me') {
    const posts = await PostService.getByUserId(req.user._id);
    return successHandler(res, '取得貼文成功', posts);
  }

  const currentUser = await UserService.getById(userId);
  if (!currentUser) {
    return appError(400, '無此使用者', next);
  }

  const posts = await PostService.find({ user: userId });
  return successHandler(res, '取得貼文成功', posts);
}

async function addPost(req, res, next) {
  // image是傳id值
  const { content, image } = req.body;

  if (!content) return appError('400', 'require content', next);

  if (!image) {
    const result = await PostService.create({
      content,
      user: req.user._id,
    });

    return successHandler(res, '新增貼文成功', result);
  }

  // 如果沒有該imageId，就直接在這裡出錯，並被handleErrorAsync接住
  // 不需要再此處判斷是否有值
  await getFileInfo(image);

  const result = await PostService.create({
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
    const updatePost = await PostService.findByIdAndUpdate(req.params.id, { content });

    return updatePost
      ? successHandler(res, '編輯貼文成功', updatePost)
      : appError(400, 'invalid id', next);
  }

  // 如果沒有該imageId，就直接在這裡出錯，並被handleErrorAsync接住
  // 不需要再此處判斷是否有值
  await getFileInfo(image);

  const updatePost = await PostService.findByIdAndUpdate(req.params.id, { content, image });

  return updatePost
    ? successHandler(res, '編輯貼文成功', updatePost)
    : appError(400, 'invalid id', next);
}

async function deletePost(req, res, next) {
  const oldPost = await PostService.findByIdAndDelete(req.params.id);

  return oldPost
    ? successHandler(res, '刪除貼文成功', oldPost)
    : appError(400, 'invalid id', next);
}

// 刪除所有貼文(測試用)
async function deleteManyPost(req, res) {
  const result = await PostService.deleteMany();
  return successHandler(res, '刪除貼文成功', result);
}

module.exports = {
  getManyPost,
  getUserPosts,
  getPostById,
  addPost,
  editPost,
  deletePost,
  deleteManyPost,
};
