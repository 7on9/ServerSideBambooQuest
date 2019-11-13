let DBCONST = require('../common/constant/database')
let mongoose = require('mongoose')
let Questions = require('./question')

let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

let questSchema = new mongoose.Schema(
  {
    _id_author: ObjectId,
    title: String,
    questions: [Questions.schema],
    description: String,
    // game: [ObjectId],
    img_path: String,
    isPublic: Boolean,
    deleted: Boolean,
  },
  { collection: DBCONST.DATABASE.COLLECTION.QUEST }
)

module.exports = mongoose.model(DBCONST.DATABASE.COLLECTION.QUEST, questSchema)
