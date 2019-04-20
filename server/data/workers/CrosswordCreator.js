const Seedrandom = require('seedrandom');

// TODO: map nodes to word

// TODO: find all possible positions for a word and place in
// best fit OR pick random spot, minimising graph size
// (closest to root)
function getBound(graph, strategy) {
  const keys = Object.keys(graph)
    .map(key => ({
      x: key.split(',')[0],
      y: key.split(',')[1],
    }));
  return keys.reduce((prev, curr) => {
    if (!prev) return curr;
    return {
      x: strategy(prev.x, curr.x),
      y: strategy(prev.y, curr.y),
    };
  }, null);
}

function getLowerBound(graph) {
  return getBound(graph, Math.min);
}

function getUpperBound(graph) {
  return getBound(graph, Math.max);
}

class Crossword {
  constructor(words, seed) {
    this.graph = {}; // maps characters to coords, used for collisions
    this.wordGraph = {}; // maps words to coords
    this.init(words, seed);
  }

  init(words, seed = 'Crosswords!') {
    this.rng = new Seedrandom(seed);
    const [word, ...remaining] = words;

    word.split('')
      .forEach((n, i) => {
        this.graph[`${i},0`] = n;
        this.wordGraph[`${i},0`] = [word];
      });

    remaining.forEach((value) => {
      this.addWord(value);
    });
  }

  print() {
    const lower = getLowerBound(this.graph);
    const upper = getUpperBound(this.graph);
    const diffX = (upper.x - lower.x) + 1;
    const diffY = (upper.y - lower.y) + 1;

    const printable = Array(diffY).fill(0).map(() => new Array(diffX).fill(''));

    Object.keys(this.graph).forEach((key) => {
      const x = Number(key.split(',')[0]);
      const y = Number(key.split(',')[1]);
      printable[y - lower.y][x - lower.x] = {
        value: this.graph[key],
        words: this.wordGraph[key],
      };
    });

    return printable;
  }

  addWord(word) {
    // find collision
    const lower = getLowerBound(this.graph);
    const upper = getUpperBound(this.graph);
    const diffX = (upper.x - lower.x) + 1;
    const diffY = (upper.y - lower.y) + 1;
    const positions = [];

    for (let y = 0; y < diffY; y += 1) {
      for (let x = 0; x < diffX; x += 1) {
        const coord = `${lower.x + x},${lower.y + y}`;
        const node = this.graph[coord];
        if (node) {
          const index = word.indexOf(node);
          if (index > -1) {
            const horizontal = !(
              this.graph[`${(lower.x + x) - 1},${lower.y + y}`] ||
              this.graph[`${(lower.x + x) + 1},${lower.y + y}`]
            );
            const vertical = !(
              this.graph[`${lower.x + x},${(lower.y + y) - 1}`] ||
              this.graph[`${lower.x + x},${(lower.y + y) + 1}`]
            );

            if (horizontal || vertical) {
              const diff = index;
              let from;
              let axis;

              if (horizontal) {
                from = {
                  x: (lower.x + x) - diff,
                  y: lower.y + y,
                };
                axis = 'x';
              }

              if (vertical) {
                from = {
                  x: lower.x + x,
                  y: (lower.y + y) - diff,
                };
                axis = 'y';
              }

              const collided = this.hasCollisions(word, from, axis);
              if (!collided) {
                positions.push([word, from, axis]);
              }
            }
          }
        }
      }
    }

    if (positions.length) {
      const randomPos = Math.floor(this.rng() * positions.length);
      const randomPosition = positions[randomPos];
      this.placeWord(...randomPosition);
    }
  }

  placeWord(word, { x, y }, axis) {
    const h = axis === 'x';
    for (let i = 0; i < word.length; i += 1) {
      const coord = `${x + (h ? i : 0)},${y + (!h ? i : 0)}`;
      this.graph[coord] = word[i];
      if (!this.wordGraph[coord]) {
        this.wordGraph[coord] = [];
      }
      this.wordGraph[coord].push(word);
    }
  }

  hasCollisions(word, { x, y }, axis) {
    const horizontal = axis === 'x';

    const freeSpots = [];
    for (let i = 0; i < word.length; i += 1) {
      const baseX = x + (horizontal ? i : 0);
      const baseY = y + (!horizontal ? i : 0);

      if (
        !(word[i] === this.graph[`${baseX},${baseY}`] &&
        (
          (horizontal && !this.graph[`${baseX + 1},${baseY}`]) ||
          (!horizontal && !this.graph[`${baseX},${baseY + 1}`])
        ))
      ) {
        const nodes = {
          top: this.graph[`${baseX},${baseY - 1}`],
          right: this.graph[`${baseX + 1},${baseY}`],
          bottom: this.graph[`${baseX},${baseY + 1}`],
          left: this.graph[`${baseX - 1},${baseY}`],
        };

        if (i === 0) {
          const node = horizontal ? nodes.left : nodes.top;
          freeSpots.push(node);
        } else if (i === word.length - 1) {
          // check bottom or right
          const node = horizontal ? nodes.right : nodes.bottom;
          freeSpots.push(node);
        }
        // check left and right / top and bottom
        if (horizontal) {
          freeSpots.push(nodes.top, nodes.bottom);
        } else {
          freeSpots.push(nodes.left, nodes.right);
        }
      }
    }

    return !!freeSpots.reduce((p, c) => p || c, false);
  }
}

module.exports = (words, seed) => new Crossword(words, seed).print();
