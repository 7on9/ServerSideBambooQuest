let mongoose = require('mongoose');

let ansSchema = new mongoose.Schema({
  _id: Number,
  content: String
});

module.exports = mongoose.model('ans', ansSchema);