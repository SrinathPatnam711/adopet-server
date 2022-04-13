const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RaiseSchema = Schema({
    title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  });

module.exports = mongoose.model('Raise', RaiseSchema);