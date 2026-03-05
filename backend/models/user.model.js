const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        notes: {
            type: String,
            required: true,
        }
        
    },
    //It creates 2 field which lets us know if a object is created or when it was last updated
    {
        timestamps: true,
    }

);

const User = mongoose.model("User", userSchema);

module.exports = User;
