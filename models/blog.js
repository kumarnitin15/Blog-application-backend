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
    online: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Blog", blogSchema);