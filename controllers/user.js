const HttpStatus = require('http-status-codes');
const Blog = require('../models/blog');
const User = require('../models/user');

module.exports = {
    async GetUserBlogs(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId}).populate('blogs');
            return res.status(HttpStatus.OK).json({message: 'Found the blogs of the specific user', blogs: user.blogs});
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
            const user = await User.findOne({_id: req.params.userId}).populate('followers').populate('following');
            return res.status(HttpStatus.OK).json({message: 'Found user successfully', user});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async FollowUser(req, res) {
        try {
            const user1 = await User.findOne({_id: req.user._id});
            const user2 = await User.findOne({_id: req.body.userId});
            user1.following.push(req.body.userId);
            user2.followers.push(req.user._id);
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
            user1.save();
            user2.save();
            return res.status(HttpStatus.OK).json({message: 'Unfollowed user successfully', user1, user2}); 
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    }
}