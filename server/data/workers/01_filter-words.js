const fs = require('fs');
const path = require('path');
const settings = require('../settings.json');

const readStaticList = (filename) => fs.readFileSync(path.join(__dirname, '..', 'static', filename), 'utf8').split('\n');

const words = readStaticList('raw-wordlist.txt');

const blacklists = [
  readStaticList('blacklist-names.txt'),
  readStaticList('blacklist-custom.txt'),
];
const dictionary = readStaticList('whitelist-dictionary.txt');

const whitelist = {};
dictionary.forEach((word) => {
  whitelist[word] = true;
});

const blacklist = {};
blacklists.forEach((list) => {
  list.forEach((name) => {
    blacklist[name.toLowerCase()] = true;
  });
});

const { min, max } = settings;

const filteredByLength = words.filter((word) => {
  const { length } = word.trim();
  return length >= min && length <= max;
});

const filteredByLists = filteredByLength.filter(word => whitelist[word] && !blacklist[word]);

const maxWords = 25000;
const filteredByTopX = filteredByLists.slice(0, maxWords);

fs.writeFile(path.join(__dirname, '..', 'output', 'wordlist.txt'), filteredByTopX.join('\n'), (err) => {
  if (err) {
    console.error(err);
  }
  console.log('The file saved successfully.');
});
