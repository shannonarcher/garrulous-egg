const mongoose = require('mongoose');

const LevelModel = require('../models/level');
const levelData = require('../data/output/seeded-levels.json');

const db = {
  ip: process.env.GEDB_IP,
  name: process.env.GEDB_NAME,
  user: process.env.GEDB_USER,
  pwd: process.env.GEDB_PWD,
  port: 27017,
};


/* eslint-disable no-console */
async function migrate() {
  await mongoose.connect(`mongodb://${db.user}:${db.pwd}@${db.ip}:${db.port}/${db.name}`, {
    useNewUrlParser: true,
  });
  console.log('connection made.');

  const levelCount = await LevelModel.countDocuments();

  if (levelCount === 0) {
    await LevelModel.deleteMany({});

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
    await LevelModel.insertMany(formattedLevelData);
    console.log('levels saved.');
  }

  mongoose.connection.close();
  console.log('connection closed.');
};

migrate();
