let DBCONST = require('../common/constant/database')
let mongoose = require('mongoose')
let Player = require('./player')

let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

let gameSchema = new mongoose.Schema(
  {
    id_quest: ObjectId,
    id_host: ObjectId,
    players: [Player.schema],
  },
  { collection: DBCONST.DATABASE.COLLECTION.GAME }
)

module.exports = mongoose.model(DBCONST.DATABASE.COLLECTION.GAME, gameSchema)
