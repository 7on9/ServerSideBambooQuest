let mongoose = require('mongoose')
let Ans = require('./ans')

let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

let questionSchema = new mongoose.Schema({
  _id: Number,
  quiz: String,
  ans: [Ans.schema],
  correct_id: Number,
  correct_point: Number,
  incorrect_point: Number,
  duration: Number,
  img_path: String,
  category: [ObjectId],
  nCorrectAnswer: Number,
  nIncorrectAnswer: Number,
  like: Number,
  deleted: Boolean,
})

module.exports = mongoose.model('question', questionSchema)