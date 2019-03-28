const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    aboutMe: { type: String },
    password: { type: String },
    createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("User", userSchema);