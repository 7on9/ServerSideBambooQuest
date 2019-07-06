let mongoose = require('mongoose');

let playerSchema = new mongoose.Schema({
  username: String,
  ans: [Number],
  time: Number
}, { _id: false });

module.exports = mongoose.model('player', playerSchema);