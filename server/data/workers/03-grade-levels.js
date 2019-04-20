// read in raw_levels
const fs = require('fs');
const path = require('path');
const beep = require('beepbeep');
const levels = require('../output/raw-levels.json');

const magnitude = 3;
const worth = {
  3: 0,
  4: 4 ** magnitude,
  5: 5 ** magnitude,
  6: 6 ** magnitude,
  7: 7 ** magnitude,
  8: 8 ** magnitude,
};

// flatten levels
const flattened = Object.values(levels)
  .reduce((p, c) => ({ ...p, ...c }), {});
// eslint-disable-next-line no-console
console.log('flattened!');
beep(5);

// grade levels based on the sum of the subwords
const graded = Object.keys(flattened).reduce((coll, word) => {
  const { subwords } = flattened[word];
  const grade = subwords
    .reduce((p, c) => p + worth[c.word.length], 0);

  return {
    ...coll,
    [word]: {
      ...flattened[word],
      grade,
    },
  };
}, {});
// eslint-disable-next-line no-console
console.log('graded!');
beep(5);

const topFormatted = Object.keys(graded).reduce((words, word) => [...words, {
  ...graded[word],
  value: word,
  index: undefined,
  subwords: graded[word].subwords.reduce((p, c) => [...p, c.word], []),
}], []);
// eslint-disable-next-line no-console
console.log('formatted!');
beep(5);

const topSorted = topFormatted.sort((a, b) => b.grade - a.grade);
// eslint-disable-next-line no-console
console.log('sorted!');
beep(5);

const existing = {};
topSorted.forEach((level) => {
  const key = level.value.split('').sort().join('');
  if (!existing[key]) {
    existing[key] = level;
  }
});
// eslint-disable-next-line no-console
console.log('uniquified!');
beep(5);

const topUnique = Object.keys(existing).map((key) => {
  const level = existing[key];
  level.subwords = level.subwords.filter(word => word !== level.value);
  return level;
})
  .slice(0, 100);
// eslint-disable-next-line no-console
console.log('cleaned up and ready to write!');
beep(10);

// write top 100 levels to file
fs.writeFile(path.join(__dirname, '..', 'output', 'top.json'), JSON.stringify(topUnique, null, 2), (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  // eslint-disable-next-line no-console
  console.log('The file saved successfully');
});
