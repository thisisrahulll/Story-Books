const mongoose = require("mongoose");
const moment = require('moment');
const storySchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: String,
        default: moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')
    }
});
module.exports = mongoose.model("Story", storySchema);