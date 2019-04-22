const mongoose = require('mongoose');

module.exports = mongoose.model('users', {
  id: String,
  name: String,
});
