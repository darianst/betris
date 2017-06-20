export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;
const EMPTY_BLOCK = 'gray';

const moveBlocks = (grid) => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if ( grid[x][y]['colour'] === EMPTY_BLOCK ) {
        for (let j = y; j < grid[x].length; j++) {
          if ( grid[x][j]['colour'] !== EMPTY_BLOCK ) {
            grid[x][y]['colour'] = grid[x][j]['colour'];
            grid[x][j]['colour'] = EMPTY_BLOCK;
            break;
          }
        }
      }
    }
  }
};

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor() {
    this.grid = [];

    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  render(el = document.querySelector('#gridEl')) {
    for (let x = 0; x < MAX_X; x++) {
      let id = 'col_' + x;
      let colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  rerender(el = document.querySelector('#gridEl')) {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
    this.render();
  }

  blockClicked(e, block) {
    const shape = [];
    const visited = [];
    const isVisited = (x, y) => visited.indexOf(`${x}:${y}`) > -1;
    const checkAvailability = (x, y) => {
      if (this.grid[x][y]['colour'] === block.colour && !isVisited(x, y)) return {x, y};
      else if (!isVisited(x, y)) {
        visited.push(`${x}:${y}`);
        return false;
      }
    };

    const parseShape = ({x, y}, grid = this.grid) => {
      shape.push({x, y});
      visited.push(`${x}:${y}`);

      const west = !!(x > 0 && grid[x - 1][y]) ? checkAvailability(x - 1, y) : false;
      const north = !!(y < grid[x].length - 1 && grid[x][y + 1]) ? checkAvailability(x, y + 1) : false;
      const east = !!(x < grid.length - 1 && grid[x + 1][y]) ? checkAvailability(x + 1, y) : false;
      const south = !!(y > 0 && grid[x][y - 1]) ? checkAvailability(x, y - 1) : false;

      if (west) parseShape(west, grid);
      if (north) parseShape(north, grid);
      if (east) parseShape(east, grid);
      if (south) parseShape(south, grid);
    }

    if (COLOURS.indexOf(block.colour) > -1) {
      parseShape({x: block.x, y: block.y});
    }
    if (shape.length > 1) {
      for (let i = 0; i < shape.length; i++) {
        this.grid[shape[i]['x']][shape[i]['y']]['colour'] = EMPTY_BLOCK;
      }
      moveBlocks(this.grid);
      this.rerender();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
