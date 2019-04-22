const db = require('../models/db');
const Level = require('../models/level');
const levelData = require('../data/output/seeded-levels.json');

/* eslint-disable no-console */
module.exports = {
  async up() {
    await db.connect();
    const formattedLevelData = levelData.map(({
      id,
      value: primaryWord,
      filtered: targetWords,
      all: relatedWords,
      seed,
    }) => ({
      id,
      primaryWord,
      targetWords,
      relatedWords,
      seed,
    }));
    await Level.insertMany(formattedLevelData);
    db.close();
  },
  async down() {
    await db.connect();
    await Level.deleteMany({});
    db.close();
  },
};
