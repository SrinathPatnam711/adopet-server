const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: [true, "please add email"],
  },
  subject: {
    type: String,
    require: [false, "please add subject"],
  },
  message: {
    type: String,
    require: [false, "please add feedback"],
  },
});
module.exports = mongoose.model("Contact", contactSchema);
