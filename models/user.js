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
    following: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
});

module.exports = mongoose.model("User", userSchema);