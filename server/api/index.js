const express = require('express');
const levelsRouter = require('./levels');

const router = express.Router();
router.use('/levels', levelsRouter);

module.exports = router;
