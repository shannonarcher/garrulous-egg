const mongoose = require('mongoose');

module.exports = mongoose.model('migrations', {
  name: String,
  created: Date,
});
