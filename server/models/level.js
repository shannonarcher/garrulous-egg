const mongoose = require('mongoose');

module.exports = mongoose.model('level', {
  id: String,
  primaryWord: String,
  targetWords: Array,
  relatedWords: Array,
  seed: Number,
  order: Number,
});
