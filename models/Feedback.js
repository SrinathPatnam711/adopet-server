const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: [true, "please add email"],
  },
  feedback: {
    type: String,
    require: [true, "please add feedback"],
  },
});
module.exports = mongoose.model("Feedback", feedbackSchema);
