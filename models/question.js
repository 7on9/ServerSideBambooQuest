const { QUESTION } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')
const Ans = require('./ans')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const questionSchema = new mongoose.Schema({
  _id: Number,
  quiz: String,
  ans: [Ans.schema],
  correct_id: Number,
  correct_point: Number,
  incorrect_point: Number,
  duration: Number,
  img_path: String,
  category: [ObjectId],
  n_correct_answer: Number,
  n_incorrect_answer: Number,
  like: [ObjectId],
  deleted: Boolean,
})

module.exports = mongoose.model(QUESTION, questionSchema)
