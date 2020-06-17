const { ROLE } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const roleSchema = new mongoose.Schema(
  {
    name: String,
    // roles that this role can edit/create/delete
    roles: [ObjectId],
    // methods that this role can do
    methods: [String],
  },
  { collection: ROLE }
)

module.exports = mongoose.model(ROLE, roleSchema)
