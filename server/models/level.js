const mongoose = require('mongoose');

module.exports = mongoose.model('levels', {
  id: {
    type: String,
    required: true,
  },
  primaryWord: {
    type: String,
    required: true,
  },
  targetWords: {
    type: Array,
    required: true,
  },
  relatedWords: {
    type: Array,
    required: true,
  },
  seed: {
    type: Number,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});
