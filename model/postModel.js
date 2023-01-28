const mongoose = require('mongoose')
const Schema = mongoose.Schema
const domPurifier = require('dompurify')
const { JSDOM } = require('jsdom')
const htmlPurify = domPurifier(new JSDOM().window)
const format = require('date-fns/format')

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: Array,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

postSchema.pre('validate', function (next) {
  // check if there is a description
  if (this.description) {
    this.description = htmlPurify.sanitize(this.description)
  }

  next()
})

const formatDate = (date) => {
  if (date) {
    return format(new Date(date), `MMM yyyy`).toLowerCase().toString()
  } else {
    console.log('no date')
  }
}

postSchema.virtual('formatedDate')
  .get(function () {
    return formatDate(this.createdAt);
  })

module.exports = mongoose.model('Post', postSchema)