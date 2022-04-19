const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const botresponseSchema = Schema({
  botresponse: {
    type: String,
  },
});
module.exports = mongoose.model("botresponse", botresponseSchema);
