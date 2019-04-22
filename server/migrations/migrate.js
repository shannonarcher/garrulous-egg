const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const db = require('../models/db');
const Migration = require('../models/migration');

const migrations = [];
fs.readdirSync(__dirname).forEach((file) => {
  if (file === 'migrate.js') {
    return;
  }

  migrations.push({
    name: file,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    migration: require(`./${file}`),
  });
});

async function getMigrations() {
  await db.connect();
  const completedMigrations = await Migration.find();
  db.close();
  return completedMigrations;
}

async function migrate() {
  const completedMigrations = await getMigrations();

  const incompleteMigrations = migrations
    .filter(({ name }) => !completedMigrations.find(({ name: cName }) => name === cName));

  for (let i = 0; i < incompleteMigrations.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await incompleteMigrations[i].migration.up();
    // eslint-disable-next-line no-console
    console.log(`Migration "${incompleteMigrations[i].name}" up complete.`);
  }

  await db.connect();
  await Migration.insertMany(incompleteMigrations.map(({ name }) => ({
    name,
    created: Date.now(),
  })));
  db.close();
}

async function rollback(num) {
  let completedMigrations = await getMigrations();

  if (!num) {
    completedMigrations = completedMigrations.slice(-num);
  }

  const incompleteMigrations = migrations
    .filter(({ name }) => completedMigrations.find(({ name: cName }) => name === cName));

  for (let i = 0; i < incompleteMigrations.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await incompleteMigrations[i].migration.down();
    // eslint-disable-next-line no-console
    console.log(`Migration "${incompleteMigrations[i].name}" down complete.`);
  }

  await db.connect();
  await Migration.deleteMany({});
  db.close();
}

async function run() {
  if (argv.rollback) {
    await rollback();
    await migrate();
  } else {
    await migrate();
  }
}

run();
