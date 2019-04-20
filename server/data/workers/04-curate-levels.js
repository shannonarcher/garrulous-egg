// take top_100.json and translate into actual words used + bonus words
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const shuffle = require('shuffle-array');

const top100 = require('../output/top.json');

const top100WithCurated = top100.map((level) => {
  const { subwords } = level;

  const filteredByLength = subwords.reduce((acc, curr) => ({
    ...acc,
    [curr.length]: [
      ...(acc[curr.length] || []),
      curr,
    ],
  }), {});

  const amount = 3;
  const filtered = Object.keys(filteredByLength)
    .map((length) => {
      let words = filteredByLength[length];
      if (Number(length) >= 3 || Number(length) <= 5) {
        words = words
          .slice(0, Math.max(3, Math.ceil(words.length / 20)));
        words = shuffle(words);
      }
      return words.slice(0, amount);
    })
    .reduce((acc, curr) => [...acc, ...curr], [])
    .reverse();

  return {
    ...level,
    filtered,
    all: level.subwords,
    subwords: undefined,
    grade: undefined,
    id: md5(level.value),
  };
});

fs.writeFile(path.join(__dirname, '..', 'output', 'starter_levels.json'), JSON.stringify(top100WithCurated, null, 2), (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  // eslint-disable-next-line no-console
  console.log('The file saved successfully');
});
