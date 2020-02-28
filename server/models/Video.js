const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId, //User.js 전체를 참조.
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number,
    },
    filePath : {
        type: String,
    },
    catogory: {
        type: String
    },
    views : {
        type: Number,
        default: 0 
    },
    duration :{
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true }); //만든 날과 업데이트한 날이 표시가 됨.

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }