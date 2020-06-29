const TILE_SIZE = 8;
const MAP_ROWS = 11;
const MAP_COLS = 15;
const WINDOW_WIDTH = 512;
const WINDOW_HEIGHT = 512;

class Map {
  constructor() {
    this.grid = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,0,0,0,0,0,0,0,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ]
  }

  render() {
    for(let row = 0; row < MAP_ROWS; row++) {
      for(let col = 0; col < MAP_COLS; col++) {
        const tileX = col * TILE_SIZE;
        const tileY = row* TILE_SIZE;
        const tileColor = this.grid[row][col] == 1 ? "#222" : "#FFF";
        fill(tileColor);
        rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

const grid = new Map();

function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {};

function draw() {
  grid.render();
};