// 此檔案專門定義type來讓swagger相關定義接收到

// common
/**
 * @typedef {object} commonRes
 * @property {string} status
 * @property {boolean} data
 */


// ----------post router----------------------

// req, res
/**
 * @typedef {object} getManyPostRes
 * @property {string} status
 * @property {array<Post>} data
 */

/**
 * @typedef {object} addPostReq
 * @property {string} content.require
 * @property {string} image
 */

// type
/**
 * 定義post
 * @typedef {object} Post
 * @property {string} _id -id
 * @property {string} content
 * @property {string} image
 * @property {array<string>} likes
 * @property {object} author
 * @property {string} createdAt 
 */



// ----------image router----------------------

// req, res
/**
 * @typedef {object} getImageReq
 * @property {string} content.require
 * @property {string} image
 */
/**
 * @typedef {object} postImageRes
 * @property {string} status
 * @property {ImageData} data
 */

// type
/**
 * 定義image
 * @typedef {object} ImageData
 * @property {string} imageUrl
 */