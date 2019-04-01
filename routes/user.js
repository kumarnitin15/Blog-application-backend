const express = require('express');
const router = express.Router();

const AuthHelper = require('../helpers/AuthHelper');
const UserCntrl = require('../controllers/user');

router.get('/blogs/:userId', AuthHelper.VerifyToken, UserCntrl.GetUserBlogs);
router.get('/users', AuthHelper.VerifyToken, UserCntrl.GetAllUsers);
router.get('/user/:userId', AuthHelper.VerifyToken, UserCntrl.GetUser);
router.post('/follow-user', AuthHelper.VerifyToken, UserCntrl.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, UserCntrl.UnfollowUser);

module.exports = router;