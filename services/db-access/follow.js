const mongoose = require('mongoose');
const User = require('../../models/user');

const getFollowingByUserId = async (userId) => {
  const userInfo = await User.findById(userId)
    .populate({
      path: 'following',
      select: 'name avatar',
    });

  return userInfo.following || [];
};

const getFollowersByUserId = async (userId) => {
  const userInfo = await User.findById(userId)
    .populate({
      path: 'followers',
      select: 'name avatar',
    });

  return userInfo.followers || [];
};

const follow = async (whoId, beFollowingId) => {
  const result = await User.updateOne(
    {
      _id: whoId,
      following: {
        $ne: beFollowingId,
      },
    },
    {
      $addToSet: {
        following: mongoose.Types.ObjectId(beFollowingId),
      },
    },
  );

  if (!result.matchedCount) return false;

  const result2 = await User.updateOne(
    {
      _id: beFollowingId,
      followers: {
        $ne: beFollowingId,
      },
    },
    {
      $addToSet: {
        followers: mongoose.Types.ObjectId(whoId),
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
      following: {
        $in: unFollowingId,
      },
    },
    {
      $pull: {
        following: unFollowingId,
      },
    },
  );

  if (!result.matchedCount) return false;

  const result2 = await User.updateOne(
    {
      _id: unFollowingId,
      followers: {
        $in: whoId,
      },
    },
    {
      $pull: {
        followers: whoId,
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
