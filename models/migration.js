const { MIGRATION } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')

const migrationSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
  },
  { collection: MIGRATION }
)

module.exports = mongoose.model(MIGRATION, migrationSchema)
