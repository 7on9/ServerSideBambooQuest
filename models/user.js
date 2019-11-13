let DBCONST = require('../common/constant/database')
let mongoose = require('mongoose')

let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

let userSchema = new mongoose.Schema(
  {
    email: String,
    name: String,
    dob: Number,
    password: String,
    gender: Boolean,
    organization: String,
    phone: String,
    avatar_path: String,
    last_update: Number,
    gameHistory: [ObjectId],
    deleted: Boolean,
  },
  { collection: DBCONST.DATABASE.COLLECTION.USER }
)

module.exports = mongoose.model(DBCONST.DATABASE.COLLECTION.USER, userSchema)
