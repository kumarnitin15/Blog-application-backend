const express = require('express');
const router = express.Router();

const AuthHelper = require('../helpers/AuthHelper');
const UserCntrl = require('../controllers/user');

router.get('/blogs/:userId', AuthHelper.VerifyToken, UserCntrl.GetUserBlogs);
router.get('/users', AuthHelper.VerifyToken, UserCntrl.GetAllUsers);
router.get('/user/:userId', AuthHelper.VerifyToken, UserCntrl.GetUser);
router.post('/follow-user', AuthHelper.VerifyToken, UserCntrl.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, UserCntrl.UnfollowUser);
router.get('/profile-pic/:userId', AuthHelper.VerifyToken, UserCntrl.GetProfilePic);
router.get('/notifs', AuthHelper.VerifyToken, UserCntrl.GetNotifs);

module.exports = router;