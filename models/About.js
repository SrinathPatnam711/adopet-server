const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutSchema = Schema({

    ptype: {
    type: String,
    require: true,
  },
  pbreed: {
    type: String,
    require: true,
  },
  pneeds: {
    type: String,
    require: true,
  },
  phabbits: {
    type: String,
    require: true,
  },
  experience: {
    type: String,
    require: true,
  },
  });

module.exports = mongoose.model('About', AboutSchema);