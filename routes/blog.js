const express = require('express');
const router = express.Router();

const AuthHelper = require('../helpers/AuthHelper');
const BlogCntrl = require('../controllers/blog');

router.get('/blogs', AuthHelper.VerifyToken, BlogCntrl.GetAllBlogs);
router.post('/new-blog', AuthHelper.VerifyToken, BlogCntrl.CreateNewBlog);

module.exports = router;