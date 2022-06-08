const Post = require('../../models/post');

function postFind(filter) {
  return Post.find(filter)
    .populate({
      path: 'user',
      select: 'name avatar',
    })
    .populate({
      path: 'comments',
      select: 'content image createdAt updatedAt likes user',
      options: {
        limit: 2,
        sort: {
          likes: -1,
        },
      },
    })
    .populate({
      path: 'likes',
      select: '_id name avatar',
    });
}

module.exports = {
  postFind,
};
