const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = Schema({
  response: {
    type: String,
  },
});
module.exports = mongoose.model("response", responseSchema);
