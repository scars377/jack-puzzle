const FINAL_STATE = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const MAX_MOVES = 30;
const DIRECTION = [
  -3, // up
  3,  // down
  -1, // left
  1,  // right
];
const REVERSE_DIRECTION = [
  3,  // down
  -3, // up
  1,  // right
  -1, // left
];

export default class Solver {
  constructor(grids, emptyId) {
    this.grids = grids.slice();
    this.emptyId = emptyId;
    this.ans = false;
    this.solution = [];
  }

  getSolution = () => {
    const { grids, emptyId } = this;
    if (!isSolvable(grids, emptyId)) {
      return {
        message: 'Jack: 這不可能啦，根本無解',
      };
    }

    let bounds = 0;
    while (!this.ans && bounds <= MAX_MOVES) {
      bounds = this.IDAStar(-1, 0, bounds);
    }

    if (!this.ans) {
      return {
        message: `Jack: 這 ${MAX_MOVES} 步內無解啦，你先玩一下啦~`
      };
    }

    return {
      message: 'Jack: 這太簡單啦~',
      solution: this.solution,
    };
  }

  IDAStar = (prevDirection, moves, bounds) => {
    const { grids, emptyId } = this;
    const distance = getHammingDistance(grids);
    let minBounds = moves + distance;
    if (minBounds > bounds) {
      return minBounds;
    }

    if (distance === 0) {
      this.ans = true;
      return moves;
    }

    let nextBound = Infinity;
    const emptyPos = grids[emptyId];
    for (let i = 0; i < 4; i++) {
      const direction = DIRECTION[i];
      if (REVERSE_DIRECTION[i] === prevDirection || !isValidDirection(emptyPos, direction)) {
        continue;
      }

      const nextEmptyPos = emptyPos + direction;

      this.solution[moves] = nextEmptyPos;
      swap(grids, emptyId, emptyPos, nextEmptyPos);

      minBounds = this.IDAStar(direction, moves + 1, bounds);
      if (this.ans) {
        return minBounds;
      }

      nextBound = Math.min(nextBound, minBounds);
      swap(grids, emptyId, nextEmptyPos, emptyPos);
    }

    return nextBound;
  }
}

function swap(grids, emptyId, i, j) {
  const k = grids.indexOf(j);

  grids[emptyId] = j;
  grids[k] = i;
}

function isValidDirection(current, direction) {
  switch(direction) {
    case -3: // up
      return current + direction >= 0;
    case 3:  // down
      return current + direction < 9;
    case -1: // left
      return current % 3 !== 0;
    case 1:  // right
      return current % 3 !== 2;
    default:
      return false;
  }
}

function isSolvable(grids, emptyId) {
  const inversion = grids
    .map((currentPos, index) => {
      return grids.slice(index + 1)
        .filter(pos => pos < currentPos)
        .length;
    })
    .reduce((a, b) => a + b, 0);

  return inversion % 2 === 0;
}

function getHammingDistance(grids, emptyId) {
  return grids
    .map((pos, index) => {
      if (index === emptyId) {
        return true;
      }

      return pos !== FINAL_STATE[index];
    })
    .reduce((a, b) => a + b, 0);
}
