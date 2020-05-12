const { QUEST } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')
const Questions = require('./question')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const questSchema = new mongoose.Schema(
  {
    id_author: ObjectId,
    author: String,
    title: String,
    questions: [Questions.schema],
    description: String,
    // game: [ObjectId],
    category: [ObjectId],
    img_path: String,
    is_public: Boolean,
    deleted: Boolean,
    like: [ObjectId],
  },
  { collection: QUEST }
)

module.exports = mongoose.model(QUEST, questSchema)
