const { CATEGORY } = require('../common/constant/database').SCHEMA
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    img_path: String,
    tag: [String],
  },
  { collection: CATEGORY }
)

module.exports = mongoose.model(CATEGORY, categorySchema)
