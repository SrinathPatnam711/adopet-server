const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  timings: {
    type: String,
    require: true,
  },
  rating: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Clinic', clinicSchema);

