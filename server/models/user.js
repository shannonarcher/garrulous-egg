const mongoose = require('mongoose');

module.exports = mongoose.model('users', {
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 16,
  },
});
