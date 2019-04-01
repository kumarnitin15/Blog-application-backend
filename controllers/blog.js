const HttpStatus = require('http-status-codes');
const Blog = require('../models/blog');
const User = require('../models/user');

module.exports = {
    async GetAllBlogs(req, res) {
        try {
            const blogs = await Blog.find({}).sort({createdAt: -1});
            return res.status(HttpStatus.OK).json({message: 'Found all blogs', blogs});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    CreateNewBlog(req, res) {
        const blogBody = {
            user: req.user._id,
            userFirstName: req.user.firstName,
            userLastName: req.user.lastName,
            topic: req.body.topic,
            tags: req.body.tags.split(','),
            caption: req.body.caption,
            mainImage: req.body.mainImage,
            createdAt: new Date()
        }
        Blog.create(blogBody).then(blog => {
            User.findOne({_id: req.user._id}).then(user => {
                user.blogs.unshift(blog._id);
                user.save();
                return res.status(HttpStatus.OK).json({message: 'Blog created successfully', blog});
            })
        }).catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        });
    }
}