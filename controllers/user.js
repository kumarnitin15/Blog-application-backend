const HttpStatus = require('http-status-codes');
const Blog = require('../models/blog');
const User = require('../models/user');

module.exports = {
    async GetUserBlogs(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId}).populate('blogs');
            return res.status(HttpStatus.OK).json({message: 'Found the blogs of the specific user', blogs: user.blogs, profilePic: user.profilePic});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    GetAllUsers(req, res) {
        User.find({}, (err, users) => {
            if(err) {
                console.log(err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
            } else {
                return res.status(HttpStatus.OK).json({message: 'Found users successfully', users});
            }
        });
    },

    async GetUser(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId}).populate('blogs').populate('followers').populate('following');
            return res.status(HttpStatus.OK).json({message: 'Found user successfully', user});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async GetNotifs(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id});
            let profilePics = [];
            for(let i=0; i<user.notifications.length; i++) {
                let notifUser = await User.findOne({_id: user.notifications[i].sender});
                profilePics.push(notifUser.profilePic);
            }
            //return res.status(HttpStatus.OK).json({message: 'Found user successfully', notifications: user.notifications, profilePics: profilePics});
            return res.status(HttpStatus.OK).json({message: 'Found user successfully', user, profilePics: profilePics});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async FollowUser(req, res) {
        try {
            const user1 = await User.findOne({_id: req.user._id});
            const user2 = await User.findOne({_id: req.body.userId});
            user1.following.push(req.body.userId);
            user2.followers.push(req.user._id);
            const notification = {
                sender: user1._id,
                senderName: { firstName: user1.firstName, lastName: user1.lastName },
                notificationType: 'Followers',
                content: 'is now following you.',
                isImg: true,
                imgSrc: user1.profilePic,
                createdAt: new Date()
            };
            user2.notifications.unshift(notification);
            user1.save(); user2.save();
            return res.status(HttpStatus.OK).json({message: 'Followed user successfully', user1, user2});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async UnfollowUser(req, res) {
        try {
            const user1 = await User.findOne({_id: req.user._id});
            const user2 = await User.findOne({_id: req.body.userId});
            let index = user1.following.indexOf(user2._id);
            if(index > -1)
                user1.following.splice(index, 1);
            index = user2.followers.indexOf(user1._id);
            if(index > -1)
                user2.followers.splice(index, 1);
            const notification = {
                sender: user1._id,
                senderName: { firstName: user1.firstName, lastName: user1.lastName },
                notificationType: 'Followers',
                content: 'has unfollowed you.',
                isImg: true,
                imgSrc: user1.profilePic,
                createdAt: new Date()
            };
            user2.notifications.unshift(notification);
            user1.save();
            user2.save();
            return res.status(HttpStatus.OK).json({message: 'Unfollowed user successfully', user1, user2}); 
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async GetProfilePic(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId});
            return res.status(HttpStatus.OK).json({message: 'Found profile picture successfully', imgSrc: user.profilePic});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async MarkAllNotifs(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id});
            for(let i = 0; i < user.notifications.length; i++) {
                user.notifications[i].read = true;
            }
            user.save();
            return res.status(HttpStatus.OK).json({message: 'Marked all notifications successfully'});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async MarkNotif(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id});
            user.notifications[req.body.index].read = true;
            user.save();
            return res.status(HttpStatus.OK).json({message: 'Marked notification successfully'});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async DeleteNotif(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id});
            user.notifications.splice(req.body.index, 1);
            user.save();
            return res.status(HttpStatus.OK).json({message: 'Deleted notification successfully'});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async DeleteAllNotifs(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id});
            if(user.notifications.length > 0)
                user.notifications.splice(0, user.notifications.length);
            user.save();
            return res.status(HttpStatus.OK).json({message: 'Deleted all notifications successfully'});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async UpdateProfilePic(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id});
            user.profilePic = req.body.imgSrc;
            user.save();
            return res.status(HttpStatus.OK).json({message: 'Profile  picture updated successfully'});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    }
}