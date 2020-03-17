const { PLAYER } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema(
  {
    username: String,
    ans: [Number],
    time: Number,
  },
  { _id: false }
)

module.exports = mongoose.model(PLAYER, playerSchema)
