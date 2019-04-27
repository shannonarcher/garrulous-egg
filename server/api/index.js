const express = require('express');
const usersRouter = require('./users');
const levelsRouter = require('./levels');

const router = express.Router();
router.use('/levels', levelsRouter);
router.use('/users', usersRouter);

module.exports = router;
