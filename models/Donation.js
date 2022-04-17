const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  CreditCard: {
    type: String,
    require: true,
  },
  Donation: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Donation', donationSchema);