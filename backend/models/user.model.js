const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        passage: { type: String, required: true, trim: true },
        source: { type: String, required: true, trim: true },
        commentary: { type: String, default: '', trim: true },
        tag: { type: String, default: '', trim: true },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
