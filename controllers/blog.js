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
            const user = await User.findOne({_id: blog.user});
            if(blog.online) {
                const notification = {
                    sender: req.user._id,
                    senderName: { firstName: user.firstName, lastName: user.lastName },
                    notificationType: 'Edit',
                    content: 'edited',
                    blog: blog._id,
                    blogTopic: blog.topic,
                    isIcon: true,
                    iconClass: 'edit blue icon',
                    createdAt: new Date()
                };
                let followers = [];
                for(let i=0; i<user.followers.length; i++) {
                    const follower = await User.findOne({_id: user.followers[i]});
                    followers.push(follower);
                }
                for(let i=0; i<followers.length; i++) {
                    followers[i].notifications.unshift(notification);
                    followers[i].save();
                }
            }
            blog.save();
            return res.status(HttpStatus.OK).json({message: 'Saved blog successfully'});
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
    },

    async PostBlog(req, res) {
        try {
            const blog = await Blog.findOne({_id: req.body.blogId});
            const user = await User.findOne({_id: req.user._id});
            blog.online = true;
            const notification = {
                sender: req.user._id,
                senderName: { firstName: user.firstName, lastName: user.lastName },
                notificationType: 'New Blog',
                content: 'posted a new blog:',
                blog: blog._id,
                blogTopic: blog.topic,
                isIcon: true,
                iconClass: 'pencil black icon',
                createdAt: new Date()
            };
            let followers = [];
            for(let i=0; i<user.followers.length; i++) {
                const follower = await User.findOne({_id: user.followers[i]});
                followers.push(follower);
            }

            for(let i=0; i<followers.length; i++) {
                followers[i].notifications.unshift(notification);
                followers[i].save();
            }
            blog.save();
            return res.status(HttpStatus.OK).json({message: 'Posted blog successfully'});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    DeleteBlog(req, res) {
        Blog.deleteOne({_id: req.body.blogId}, (err) => {
            if(err) {
                console.log(err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
            }
            User.findOne({_id: req.user._id}, (err, user) => {
                if(err) {
                    console.log(err);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
                }
                const index = user.blogs.indexOf(req.body.blogId);
                if(index > -1)
                    user.blogs.splice(index, 1);
                user.save();
                return res.status(HttpStatus.OK).json({message: 'Deleted blog successfully'});
            });
        });
    },

    async AddLike(req, res) {
        try {
            const blog = await Blog.findOne({_id: req.body.blogId});
            const user = await User.findOne({_id: req.user._id});
            blog.likes.push(user._id);
            const notification = {
                sender: req.user._id,
                senderName: { firstName: user.firstName, lastName: user.lastName },
                notificationType: 'Like',
                content: 'liked',
                blog: blog._id,
                blogTopic: blog.topic,
                isIcon: true,
                iconClass: 'heart red icon',
                createdAt: new Date()
            };
            let followers = [];
            for(let i=0; i<user.followers.length; i++) {
                const follower = await User.findOne({_id: user.followers[i]});
                followers.push(follower);
            }

            for(let i=0; i<followers.length; i++) {
                followers[i].notifications.unshift(notification);
                followers[i].save();
            }
            blog.save();
            return res.status(HttpStatus.OK).json({message: 'Added like successfully'});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async AddComment(req, res) {
        try {
            const blog = await Blog.findOne({_id: req.body.blogId});
            const user = await User.findOne({_id: req.user._id});
            const comment = {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePic: user.profilePic
                },
                comment: req.body.comment,
                createdAt: new Date()
            };

            const notification = {
                sender: req.user._id,
                senderName: { firstName: user.firstName, lastName: user.lastName },
                notificationType: 'Comment',
                content: 'commented on',
                blog: blog._id,
                blogTopic: blog.topic,
                isIcon: true,
                iconClass: 'comment black icon',
                createdAt: new Date()
            };
            let followers = [];
            for(let i=0; i<user.followers.length; i++) {
                const follower = await User.findOne({_id: user.followers[i]});
                followers.push(follower);
            }

            for(let i=0; i<followers.length; i++) {
                followers[i].notifications.unshift(notification);
                followers[i].save();
            }

            blog.comments.unshift(comment);
            blog.save();
            return res.status(HttpStatus.OK).json({message: 'Added comment successfully'});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async ShareBlog(req, res) {
        try {
            const blog = await Blog.findOne({_id: req.body.blogId});
            const user = await User.findOne({_id: req.user._id});

            const notification = {
                sender: req.user._id,
                senderName: { firstName: user.firstName, lastName: user.lastName },
                notificationType: 'Share',
                content: 'shared the blog:',
                blog: blog._id,
                blogTopic: blog.topic,
                isIcon: true,
                iconClass: 'share black icon',
                createdAt: new Date()
            };
            let followers = [];
            for(let i=0; i<user.followers.length; i++) {
                const follower = await User.findOne({_id: user.followers[i]});
                followers.push(follower);
            }

            for(let i=0; i<followers.length; i++) {
                followers[i].notifications.unshift(notification);
                followers[i].save();
            }

            blog.shares.push(user._id);
            blog.save();
            return res.status(HttpStatus.OK).json({message: 'Shared blog successfully'});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    },

    async GetBookmarkedBlogs(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id});
            let blogs = [];
            let profilePics = [];
            for(let i=0; i<user.bookmarks.length; i++) {
                const blog = await Blog.findOne({_id: user.bookmarks[i]});
                const author = await User.findOne({_id: blog.user});
                blogs.push(blog);
                profilePics.push(author.profilePic);
            }
            return res.status(HttpStatus.OK).json({message: 'Found bookarked blogs successfully', blogs, profilePics});
        }
        catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
        }
    }
}