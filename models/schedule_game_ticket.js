const { SCHEDULE_GAME_TICKET } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const scheduleGameTicketSchema = new mongoose.Schema(
  {
    id_quest: ObjectId,
    begin_at: Number,
  },
  { collection: SCHEDULE_GAME_TICKET }
)

module.exports = mongoose.model(SCHEDULE_GAME_TICKET, scheduleGameTicketSchema)
