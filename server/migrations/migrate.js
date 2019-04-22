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

async function rollback(num = 0) {
  let completedMigrations = await getMigrations();
  if (num) {
    completedMigrations = completedMigrations.slice(-num);
  }

  const incompleteMigrations = migrations
    .filter(({ name }) => completedMigrations.find(({ name: cName }) => name === cName));

  for (let i = incompleteMigrations.length; i >= 0; i -= 1) {
    // eslint-disable-next-line no-await-in-loop
    await incompleteMigrations[i].migration.down();
    // eslint-disable-next-line no-console
    console.log(`Migration "${incompleteMigrations[i].name}" down complete.`);
  }

  await db.connect();
  if (!num) {
    await Migration.deleteMany({});
  } else if (incompleteMigrations.length) {
    await Migration.deleteMany({
      created: { $gte: incompleteMigrations[0].created },
    });
  }
  db.close();
}

async function run() {
  if (argv.refresh || argv.rollback !== undefined) {
    console.log('Rolling back.', argv.rollback || '');
    await rollback(argv.rollback);
    if (argv.refresh) {
      console.log('Migrating.');
      await migrate();
    }
  } else {
    await migrate();
  }
}

run();
