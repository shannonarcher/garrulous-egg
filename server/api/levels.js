const express = require('express');
const db = require('../models/db');
const Level = require('../models/level');

const router = express.Router();

/* GET levels. */
router.get('/', async (req, res) => {
  db.connect();
  const levels = await Level.find({}, 'id primaryWord order');
  db.close();
  res.json(levels);
});

/* GET level count. */
router.get('/count', async (req, res) => {
  db.connect();
  const levelCount = await Level.countDocuments();
  db.close();
  res.json(levelCount);
});

/* GET level count. */
router.get('/:id', async (req, res) => {
  db.connect();
  const levelCount = await Level.findOne({ id: req.params.id });
  db.close();
  res.json(levelCount);
});

module.exports = router;
