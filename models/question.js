let mongoose = require('mongoose');
let Ans = require("./ans");

let questionSchema = new mongoose.Schema({
  _id: Number,
  quiz: String,
  ans: [Ans.schema],
  correct_id: Number,
  correct_point: Number,
  incorrect_point: Number,
  duration: Number,
  img: String
});

module.exports = mongoose.model('question', questionSchema);