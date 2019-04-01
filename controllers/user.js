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

    GetUser(req, res) {
        User.find({_id: req.params.userId}, (err, user) => {
            if(err) {
                console.log(err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
            } else {
                return res.status(HttpStatus.OK).json({message: 'Found user successfully', user});
            }
        });
    }
}