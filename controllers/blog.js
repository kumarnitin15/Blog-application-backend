const HttpStatus = require('http-status-codes');
const Blog = require('../models/blog');
const User = require('../models/user');

module.exports = {
    async GetAllBlogs(req, res) {
        try {
            const blogs = await Blog.find({}).sort({createdAt: -1});
            let profilePics = [];
            for(let i=0; i<blogs.length; i++) {
                const user = await User.findOne({_id: blogs[i].user});
                profilePics.push(user.profilePic);
            }
            return res.status(HttpStatus.OK).json({message: 'Found all blogs', blogs, profilePics});
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
    },

    async GetBlogById(req, res) {
        try {
            const blog = await Blog.findOne({_id: req.params.blogId});
            return res.status(HttpStatus.OK).json({message: 'Found blog successfully', blog});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async SaveBlog(req, res) {
        try {
            const blog = await Blog.findOne({_id: req.body.blogId});
            blog.topic = req.body.topic;
            blog.caption = req.body.caption;
            blog.content = req.body.content;
            blog.mainImage = req.body.mainImage;
            blog.save();
            return res.status(HttpStatus.OK).json({message: 'Saved blog successfully', blog});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async AddView(req, res) {
        try {
            const blog = await Blog.findOne({_id: req.body.blogId});
            blog.views.push(req.user._id);
            blog.save();
            return res.status(HttpStatus.OK).json({message: 'Added view successfully'});
        }
        catch(err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    }
}