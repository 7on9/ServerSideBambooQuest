const { GAME } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')
const Player = require('./player')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const gameSchema = new mongoose.Schema(
  {
    id_quest: ObjectId,
    id_host: ObjectId,
    players: [Player.schema],
  },
  { collection: GAME }
)

module.exports = mongoose.model(GAME, gameSchema)
