const mongoose = require("mongoose");
const ouruserSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model("Ouruser", ouruserSchema);