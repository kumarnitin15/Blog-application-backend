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
router.post('/markAllNotifs', AuthHelper.VerifyToken, UserCntrl.MarkAllNotifs);
router.post('/markNotif', AuthHelper.VerifyToken, UserCntrl.MarkNotif);
router.post('/deleteNotif', AuthHelper.VerifyToken, UserCntrl.DeleteNotif);
router.post('/deleteAllNotifs', AuthHelper.VerifyToken, UserCntrl.DeleteAllNotifs);
router.post('/update-profile-pic', AuthHelper.VerifyToken, UserCntrl.UpdateProfilePic);
router.post('/add-bookmark', AuthHelper.VerifyToken, UserCntrl.AddBookmark);

module.exports = router;