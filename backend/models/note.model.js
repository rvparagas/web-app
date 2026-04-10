const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        passage: { type: String, required: true, trim: true },
        source: { type: String, required: true, trim: true },
        commentary: { type: String, default: '', trim: true },
        tag: { type: String, default: '', trim: true },

        // link between the notes and the logged-in user
        owner: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'AuthUser', 
            required: true 
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
