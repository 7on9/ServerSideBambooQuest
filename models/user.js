const { USER } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const userSchema = new mongoose.Schema(
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
    game_history: [ObjectId],
    role: ObjectId,
    deleted: Boolean,
  },
  { collection: USER }
)

module.exports = mongoose.model(USER, userSchema)
