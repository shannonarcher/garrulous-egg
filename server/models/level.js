const mongoose = require('mongoose');

module.exports = mongoose.model('levels', {
  id: String,
  primaryWord: String,
  targetWords: Array,
  relatedWords: Array,
  seed: Number,
  order: Number,
});
