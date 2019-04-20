const fs = require('fs');
const path = require('path');
const settings = require('../settings.json');

const words = fs.readFileSync(path.join(__dirname, '..', 'output', 'wordlist.txt'), 'utf8').split('\n');

function stringToMap(s) {
  const o = {};
  for (let i = 0; i < s.length; i += 1) o[s[i]] = o[s[i]] ? o[s[i]] + 1 : 1;
  return o;
}

function fastContains(c, p) {
  const cMap = stringToMap(c);
  const pMap = stringToMap(p);
  return Object.keys(pMap).every(letter => cMap[letter] && cMap[letter] >= pMap[letter]);
}

const { min, max, difficulties } = settings;

const buckets = {};

for (let i = min; i <= max; i += 1) {
  buckets[i] = words.filter(word => word.length === i);
}

let totalLevels = 0;
Object.keys(difficulties).forEach((difficulty) => {
  totalLevels += buckets[difficulties[difficulty]].length;
  // eslint-disable-next-line no-console
  console.log(`${buckets[difficulties[difficulty]].length} ${difficulty} potential levels available`);
});

const levels = {};
let totalLevelsDeveloped = 0;
Object.keys(difficulties).forEach((difficulty) => {
  const length = difficulties[difficulty];
  const allWords = buckets[length];

  levels[length] = {};
  allWords.forEach((word, index) => {
    levels[length][word] = {
      index,
      subwords: [],
    };

    for (let i = length; i >= min; i -= 1) {
      const otherWords = buckets[i];
      otherWords.forEach((other, otherIndex) => {
        if (other !== word && fastContains(word, other)) {
          levels[length][word].subwords.push({
            word: other,
            index: otherIndex,
          });
        }
      });
    }

    totalLevelsDeveloped += 1;
    const progress = Math.round(totalLevelsDeveloped / totalLevels * 10000) / 100;
    process.stdout.clearLine(); // clear current text
    process.stdout.cursorTo(0); // move cursor to beginning of line
    process.stdout.write(`${progress}% complete.`); //
  });
});

fs.writeFile(path.join(__dirname, '..', 'output', 'raw-levels.json'), JSON.stringify(levels, null, 2), (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  // eslint-disable-next-line no-console
  console.log('The file saved successfully');
});
