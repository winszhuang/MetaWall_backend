const Post = require('../../models/post');
const { pick } = require('../../utils/pick');
const { DEFAULT_SORT } = require('../../constants/default');
const parsePaginationInfo = require('../pagination/parsePaginationInfo');

const getById = (id) => find({ _id: id });

const getByUserId = (userId) => find({ user: userId });

const create = (doc) => Post.create(doc);

const deleteMany = () => Post.deleteMany();

// eslint-disable-next-line max-len
const findByIdAndUpdate = (id, updateQuery, isNew = true) => Post.findByIdAndUpdate(id, updateQuery, { new: isNew });

const findByIdAndDelete = (id) => Post.findByIdAndDelete(id);

const findByReq = (req) => {
  req.query.createdAt ??= DEFAULT_SORT;

  const { q } = req.query;

  const query = q ? { content: new RegExp(`${q}`, 'i') } : {};
  const sorter = pick(req.query, ['likes', 'comments', 'createdAt']);
  const pagination = pick(req.query, ['pageIndex', 'pageSize']);

  return find(query, sorter, pagination);
};

const find = (filter = {}, sorter = {}, paginer = {}) => {
  const { skip, limit } = parsePaginationInfo(paginer);

  return Post.find(filter)
    .sort(sorter)
    .skip(skip)
    .limit(limit)
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
};

module.exports = {
  find,
  findByReq,
  getById,
  getByUserId,
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
  deleteMany,
};
