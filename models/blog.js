const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    topic: { type: String },
    caption: { type: String },
    tags: [ {type: String} ],
    content: { type: String, default: '' },
    mainImage: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userFirstName: { type: String },
    userLastName: { type: String },
    views: [ {type: mongoose.Schema.Types.ObjectId, ref: "User"} ],
    likes: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    comments: [ {
        user: {
            id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
            firstName: { type: String, default: '' },
            lastName: { type: String, default: '' },
            profilePic: { type: String, default: '' }
        },
        comment: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now() }
    } ],
    online: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Blog", blogSchema);