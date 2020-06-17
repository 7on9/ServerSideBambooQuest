const { ANS } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')

const ansSchema = new mongoose.Schema({
  _id: Number,
  content: String,
})

module.exports = mongoose.model(ANS, ansSchema)
