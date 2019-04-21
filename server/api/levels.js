const express = require('express');
const db = require('../models/db');
const Level = require('../models/level');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  db.connect();
  const levels = await Level.find({}, 'id primaryWord order');
  db.close();
  res.json(levels);
});

module.exports = router;
