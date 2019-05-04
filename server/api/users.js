const express = require('express');
const md5 = require('md5');

const db = require('../models/db');
const User = require('../models/user');

const router = express.Router();

router.get('/:name', async (req, res) => {
  db.connect();
  const user = await User.findOne({ name: req.params.name });
  db.close();

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    res.send({ error: 'Not found' });
  }
});

router.post('/', async (req, res) => {
  db.connect();
  const { name } = req.body;
  let user = await User.findOne({ name });
  if (!user) {
    user = await User.create({
      id: md5(name),
      name,
    });
  }
  db.close();
  res.json({
    id: user.id,
    name: user.name,
  });
});

module.exports = router;
