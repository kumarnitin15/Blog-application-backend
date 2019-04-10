const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    aboutMe: { type: String },
    blogs: [ { type: mongoose.Schema.Types.ObjectId, ref: "Blog" } ],
    password: { type: String },
    profilePic: { type: String, default: 'http://profilepicturesdp.com/wp-content/uploads/2018/06/default-dp-6.png' },
    createdAt: { type: Date, default: Date.now() },
    followers: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    following: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    notifications: [
        {
            read: { type: Boolean, default: false },
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            senderName: { firstName: String, lastName: String },
            notificationType: { type: String },
            content: { type: String },
            blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
            blogTopic: { type: String, default: '' },
            isIcon: { type: Boolean, default: false },
            isImg: { type: Boolean, default: false },
            iconClass: { type: String, default: '' },
            imgSrc: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now() }
        }
    ],
    images: [],
    bookmarks: [ { type: mongoose.Schema.Types.ObjectId, ref: "Blog" } ]
});

module.exports = mongoose.model("User", userSchema);