const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    google_id: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    user_img: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model("User", userSchema);