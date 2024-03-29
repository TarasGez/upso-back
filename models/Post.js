const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: {
    type: String,
    required: true
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
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      createdDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdDate: {
    type: Date,
    default: Date.now
  }
})

const populationFields = 'user'

postSchema.post('save', async (doc) => {
  await doc.populate(populationFields).execPopulate()
})

function populateFields() {
  this.populate(populationFields)
}

postSchema.pre('find', populateFields)
postSchema.pre('findOne', populateFields)
postSchema.pre('findOneAndUpdate', populateFields)

module.exports = mongoose.model('posts', postSchema)
