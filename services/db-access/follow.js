const User = require('../../models/user');

const getFollowingByUserId = async (userId) => {
  const userInfo = await User.findById(userId)
    .populate({
      path: 'following.user',
      select: 'name avatar',
    });

  return userInfo.following || [];
};

const getFollowersByUserId = async (userId) => {
  const userInfo = await User.findById(userId)
    .populate({
      path: 'followers.user',
      select: 'name avatar',
    });

  return userInfo.followers || [];
};

const follow = async (whoId, beFollowingId) => {
  const result = await User.updateOne(
    {
      _id: whoId,
      'following.user': {
        $ne: beFollowingId,
      },
    },
    {
      $addToSet: {
        following: {
          user: beFollowingId,
        },
      },
    },
  );

  if (!result.matchedCount) return false;

  const result2 = await User.updateOne(
    {
      _id: beFollowingId,
      'followers.user': {
        $ne: beFollowingId,
      },
    },
    {
      $addToSet: {
        followers: {
          user: whoId,
        },
      },
    },
  );

  if (!result2.matchedCount) return false;
  return true;
};

const unFollow = async (whoId, unFollowingId) => {
  const result = await User.updateOne(
    {
      _id: whoId,
      'following.user': {
        $in: unFollowingId,
      },
    },
    {
      $pull: {
        following: {
          user: unFollowingId,
        },
      },
    },
  );

  if (!result.matchedCount) return false;

  const result2 = await User.updateOne(
    {
      _id: unFollowingId,
      'followers.user': {
        $in: whoId,
      },
    },
    {
      $pull: {
        followers: {
          user: whoId,
        },
      },
    },
  );

  if (!result2.matchedCount) return false;
  return true;
};

module.exports = {
  getFollowingByUserId,
  getFollowersByUserId,
  follow,
  unFollow,
};
