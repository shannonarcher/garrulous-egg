const mongoose = require('mongoose');

const db = require('../models/db');
const Level = require('../models/level');
const levelData = require('../data/output/seeded-levels.json');

/* eslint-disable no-console */
async function migrate() {
  await db.connect();
  console.log('connection made.');

  const levelCount = await Level.countDocuments();

  if (levelCount === 0) {
    await Level.deleteMany({});

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
    console.log('levels saved.');
  }

  db.close();
  console.log('connection closed.');
};

migrate();
