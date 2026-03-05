const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        passage: { type: String, required: true },
        source: { type: String, required: true },
        commentary: { type: String, default: '' },
        tag: { type: String, default: '' },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
