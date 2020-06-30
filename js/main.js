const TILE_SIZE = 32;
const MAP_ROWS = 16;
const MAP_COLS = 16;
const WINDOW_WIDTH = 512;
const WINDOW_HEIGHT = 512;

class Map {
  constructor() {
    this.grid = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  }

  render() {
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const tileX = col * TILE_SIZE;
        const tileY = row * TILE_SIZE;
        const tileColor = this.grid[row][col] == 1 ? "#333" : "#FFF";
        fill(tileColor);
        rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  isOutOfBounds(x, y) {
    return x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT;
  }

  isWallAt(x, y) {
    return this.grid[Math.floor(y / TILE_SIZE)][Math.floor(x / TILE_SIZE)] == 1;
  }
}

class Player {
  constructor() {
    this.x = 192;
    this.y = 448;
    this.radius = 8;
    this.turnDirection = 0; // -1 is left, 1 is right
    this.walkDirection = 0; // -1 is back, 1 is front
    this.rotationAngle = -Math.PI / 2;
    this.moveSpeed = 3.0;
    this.rotationSpeed = 3.0 * (Math.PI / 180);
  }

  update() {
    this.rotationAngle += this.turnDirection * this.rotationSpeed;
    const moveStep = this.walkDirection * this.moveSpeed;
    const nextX = this.x + Math.cos(this.rotationAngle) * moveStep;
    const nextY = this.y + Math.sin(this.rotationAngle) * moveStep;
    
    if (!grid.isWallAt(nextX, nextY) && !grid.isOutOfBounds(nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
    }
  }

  render() {
    fill("red");
    circle(this.x, this.y, this.radius);
    stroke("red")
    line(
      this.x,
      this.y,
      this.x + Math.cos(this.rotationAngle) * 30,
      this.y + Math.sin(this.rotationAngle) * 30
    );
    stroke("#333");
  }
}

const grid = new Map();
const player = new Player();

function keyPressed() {
  if(keyCode === UP_ARROW)
    player.walkDirection = 1;
  else if (keyCode === DOWN_ARROW)
    player.walkDirection = -1;
  else if (keyCode === LEFT_ARROW)
    player.turnDirection = -1;
  else if (keyCode === RIGHT_ARROW)
    player.turnDirection = 1;
}

function keyReleased() {
  if(keyCode === UP_ARROW)
    player.walkDirection = 0;
  else if (keyCode === DOWN_ARROW)
    player.walkDirection = 0;
  else if (keyCode === LEFT_ARROW)
    player.turnDirection = 0;
  else if (keyCode === RIGHT_ARROW)
    player.turnDirection = 0;
}

function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
  player.update();
};

function draw() {
  update();
  grid.render();
  player.render();
};