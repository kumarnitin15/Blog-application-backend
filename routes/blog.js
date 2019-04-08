const express = require('express');
const router = express.Router();

const AuthHelper = require('../helpers/AuthHelper');
const BlogCntrl = require('../controllers/blog');

router.get('/blogs', AuthHelper.VerifyToken, BlogCntrl.GetAllBlogs);
router.post('/create-new-blog', AuthHelper.VerifyToken, BlogCntrl.CreateNewBlog);
router.get('/blog/:blogId', AuthHelper.VerifyToken, BlogCntrl.GetBlogById);
router.post('/save-blog', AuthHelper.VerifyToken, BlogCntrl.SaveBlog);
router.post('/add-view', AuthHelper.VerifyToken, BlogCntrl.AddView);

module.exports = router;