const fs = require('fs');
const path = require('path');

const StarterLevels = require('../output/starter-levels.json');
const CrosswordCreator = require('./CrosswordCreator');

const seeds = [2167];
const limit = 3000;
for (let i = 1000; i < limit; i += 1) {
  seeds.push(i);
}

// function graphToString(graph) {
//   return graph.map(row => (
//     row.map(node => (node ? node.value : ' ').join(' '))
//   )).join('\n');
// }

function flattenGraph(graph) {
  return graph.reduce((acc, row) => acc.concat(row), []);
}

function hasWords(graph, words) {
  const check = flattenGraph(graph).reduce((acc, curr) => {
    if (curr.words) {
      return curr.words.reduce((acc2, word) => ({
        ...acc2,
        [word]: true,
      }), acc);
    }
    return acc;
  }, {});
  return words.every(word => check[word]);
}

function calcScore(graph) {
  const width = graph[0].length;
  const height = graph.length;

  const size = width * height;

  const flattened = flattenGraph(graph);
  const connections = flattened.reduce((acc, node) => {
    if (node.words && node.words.length > 1) {
      return acc + (node.words.length ** 2);
    }
    return acc;
  });

  return connections - size;
}

const seeded = StarterLevels.map((level, i) => {
  const { value, filtered } = level;
  const words = [value, ...filtered];
  let maxScore = 0;
  let maxSeed = null;

  seeds.forEach((seed) => {
    const crossword = CrosswordCreator(words, seed);

    // make sure all words are present
    if (hasWords(crossword, words)) {
      // measure crossword
      const score = calcScore(crossword);

      if (maxScore < score) {
        maxScore = score;
        maxSeed = seed;
      }
    }
  });

  const progress = Math.round((i / StarterLevels.length) * 10000) / 100;
  process.stdout.clearLine(); // clear current text
  process.stdout.cursorTo(0); // move cursor to beginning of line
  process.stdout.write(`${progress}% complete.`);

  if (maxSeed === null) {
    // eslint-disable-next-line no-console
    console.log(`Failed to find crossword that contains all words. ${level.id}`)
  }

  return {
    ...level,
    seed: maxSeed,
  };
});


fs.writeFile(path.join(__dirname, '..', 'output', 'seeded-levels.json'), JSON.stringify(seeded, null, 2), (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  // eslint-disable-next-line no-console
  console.log("The file saved successfully.");
});
