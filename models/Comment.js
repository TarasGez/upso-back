const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    postId: {
	type: Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    parentId: {
	type: Schema.Types.ObjectId,
        ref: 'comments'
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('comments', commentSchema)
