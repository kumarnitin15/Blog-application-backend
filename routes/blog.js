const express = require('express');
const router = express.Router();

const AuthHelper = require('../helpers/AuthHelper');
const BlogCntrl = require('../controllers/blog');

router.get('/blogs', AuthHelper.VerifyToken, BlogCntrl.GetAllBlogs);
router.post('/create-new-blog', AuthHelper.VerifyToken, BlogCntrl.CreateNewBlog);
router.get('/blog/:blogId', AuthHelper.VerifyToken, BlogCntrl.GetBlogById);
router.post('/save-blog', AuthHelper.VerifyToken, BlogCntrl.SaveBlog);
router.post('/add-view', AuthHelper.VerifyToken, BlogCntrl.AddView);
router.post('/post-blog', AuthHelper.VerifyToken, BlogCntrl.PostBlog);
router.post('/delete-blog', AuthHelper.VerifyToken, BlogCntrl.DeleteBlog);
router.post('/add-like', AuthHelper.VerifyToken, BlogCntrl.AddLike);
router.post('/add-comment', AuthHelper.VerifyToken, BlogCntrl.AddComment);
router.post('/share-blog', AuthHelper.VerifyToken, BlogCntrl.ShareBlog);
router.get('/bookmarked-blogs', AuthHelper.VerifyToken, BlogCntrl.GetBookmarkedBlogs);

module.exports = router;