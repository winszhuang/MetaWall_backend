const express = require('express');
const router = express.Router();
const { getManyPost, addPost } = require('../controller/post');


/**
 * GET /posts/?:
 * @summary 取得所有貼文
 * @tags posts
 * @return {getManyPostRes} 200 - success response - application/json
 */

router.get('/', getManyPost);


/**
 * POST /posts
 * @summary 增加新的貼文
 * @tags posts
 * @param {addPostReq} request.body
 * @return {commonRes} 200 - success response - application/json
 */

router.post('/',addPost);



module.exports = router;