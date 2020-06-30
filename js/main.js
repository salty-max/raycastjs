const TILE_SIZE = 32;
const MAP_ROWS = 16;
const MAP_COLS = 16;
const WINDOW_WIDTH = 512;
const WINDOW_HEIGHT = 512;
const FOV_ANGLE = 90;
const WALL_STRIP_WIDTH = 5;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

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
    this.rotationAngle = -degToRad(90.0);
    this.moveSpeed = 3.0;
    this.rotationSpeed = degToRad(3.0);
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

class Ray {
  constructor(rayAngle) {
    this.rayAngle = rayAngle;
  }

  render() {
    stroke("rgba(255, 0, 0, 0.1)");
    line(player.x, player.y, player.x + Math.cos(this.rayAngle) * 90, player.y + Math.sin(this.rayAngle) * 90);
    noStroke();
  }
}

const grid = new Map();
const player = new Player();
// const rays = [];

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

function castAllRays() {
  let columnIndex = 0;
  rays = [];

  // Cast first ray at half of the FOV
  let rayAngle = player.rotationAngle - degToRad(FOV_ANGLE) / 2;

  for (let i = 0; i < NUM_RAYS; i++) {
    const ray = new Ray(rayAngle);
    // TODO: ray.cast(columnIndex);
    rays.push(ray);

    rayAngle += degToRad(FOV_ANGLE) / NUM_RAYS;
    columnIndex++;
  }

}

function degToRad(a) {
  return a * (Math.PI / 180);
} 

function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
  player.update();
  castAllRays();
};

function draw() {
  update();
  grid.render();
  rays.forEach(ray => {
    ray.render();
  })
  player.render();
};