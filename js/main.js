const TILE_SIZE = 32;
const MAP_ROWS = 16;
const MAP_COLS = 16;
const WINDOW_WIDTH = 512;
const WINDOW_HEIGHT = 512;
const FOV_ANGLE = degToRad(90);
const WALL_STRIP_WIDTH = 1;
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
    if (this.isOutOfBounds(x, y)) return true;

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
    this.rotationAngle = -(Math.PI / 2);
    this.moveSpeed = 3.0;
    this.rotationSpeed = degToRad(3);
  }

  update() {
    this.rotationAngle += this.turnDirection * this.rotationSpeed;
    const moveStep = this.walkDirection * this.moveSpeed;
    const nextX = this.x + Math.cos(this.rotationAngle) * moveStep;
    const nextY = this.y + Math.sin(this.rotationAngle) * moveStep;
    
    if (!grid.isWallAt(nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
    }
  }

  render() {
    fill("red");
    circle(this.x, this.y, this.radius);
    // stroke("red")
    // line(
    //   this.x,
    //   this.y,
    //   this.x + Math.cos(this.rotationAngle) * 30,
    //   this.y + Math.sin(this.rotationAngle) * 30
    // );
    stroke("#333");
  }
}

class Ray {
  constructor(rayAngle) {
    this.rayAngle = normalizeAngle(rayAngle);
    this.wallHitX = 0;
    this.wallHitY = 0;
    this.distance = 0;
    this.wasHitVertical = false;

    this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
    this.isRayFacingUp = !this.isRayFacingDown;
    this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
    this.isRayFacingLeft = !this.isRayFacingRight;
  }

  cast(columnIndex) {
    let xIntercept, yIntercept;
    let xStep, yStep;

    /**
     * Horizontal Ray-grid intersection
     */
    let foundHorizontalWallHit = false;
    let horizontalWallHitX = 0;
    let horizontalWallHitY = 0;

    // Find the y-coordinate of the closest horizontal grid intersection
    yIntercept = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
    yIntercept += this.isRayFacingDown ? TILE_SIZE : 0; 

    // Find the x-coordinate of the closest horizontal grid intersection
    xIntercept = player.x + (yIntercept - player.y) / Math.tan(this.rayAngle);

    // Calculate increment for xStep and yStep
    yStep = TILE_SIZE;
    yStep *= this.isRayFacingUp ? -1 : 1;

    xStep = yStep / Math.tan(this.rayAngle);
    xStep *= (this.isRayFacingLeft && xStep > 0) ? -1 : 1;
    xStep *= (this.isRayFacingRight && xStep < 0) ? -1 : 1;

    let nextHorizontalTouchX = xIntercept;
    let nextHorizontalTouchY = yIntercept;
    if (this.isRayFacingUp)
      nextHorizontalTouchY--;
    
    // Increment xStep and yStep until we find a wall
    while(nextHorizontalTouchX >= 0 && nextHorizontalTouchX <= WINDOW_WIDTH && nextHorizontalTouchY >= 0 && nextHorizontalTouchY <= WINDOW_HEIGHT) {
      if (grid.isWallAt(nextHorizontalTouchX, nextHorizontalTouchY)) {
        foundHorizontalWallHit = true;
        horizontalWallHitX = nextHorizontalTouchX;
        horizontalWallHitY = nextHorizontalTouchY;
        break;
      } else {
        nextHorizontalTouchX += xStep;
        nextHorizontalTouchY += yStep;
      }
    }

    /**
     * Vertical Ray-grid intersection
     */
    let foundVerticalWallHit = false;
    let verticalWallHitX = 0;
    let verticalWallHitY = 0;

    // Find the x-coordinate of the closest vertical grid intersection
    xIntercept = Math.floor(player.x / TILE_SIZE) * TILE_SIZE;
    xIntercept += this.isRayFacingRight ? TILE_SIZE : 0; 

    // Find the y-coordinate of the closest vertical grid intersection
    yIntercept = player.y + (xIntercept - player.x) * Math.tan(this.rayAngle);

    // Calculate increment for xStep and yStep
    xStep = TILE_SIZE;
    xStep *= this.isRayFacingLeft ? -1 : 1;

    yStep = xStep * Math.tan(this.rayAngle);
    yStep *= (this.isRayFacingUp && yStep > 0) || (this.isRayFacingDown && yStep < 0) ? -1 : 1;

    let nextVerticalTouchX = xIntercept;
    let nextVerticalTouchY = yIntercept;
    if (this.isRayFacingLeft)
      nextVerticalTouchX--;
    
    // Increment xStep and yStep until we find a wall
    while(nextVerticalTouchX >= 0 && nextVerticalTouchX <= WINDOW_WIDTH && nextVerticalTouchY >= 0 && nextVerticalTouchY <= WINDOW_HEIGHT) {
      if (grid.isWallAt(nextVerticalTouchX, nextVerticalTouchY)) {
        foundVerticalWallHit = true;
        verticalWallHitX = nextVerticalTouchX;
        verticalWallHitY = nextVerticalTouchY;
        break;
      } else {
        nextVerticalTouchX += xStep;
        nextVerticalTouchY += yStep;
      }
    }

    // Calculate both horizontal and vertical distances and choose the closest one
    const horizontalHitDistance = foundHorizontalWallHit
      ? distanceBetweenPoints(player.x, player.y, horizontalWallHitX, horizontalWallHitY)
      : Number.MAX_VALUE;
    const verticalHitDistance = foundVerticalWallHit
      ? distanceBetweenPoints(player.x, player.y, verticalWallHitX, verticalWallHitY)
      : Number.MAX_VALUE;

    // Only store the smallest X, Y and distance
    this.wallHitX = horizontalHitDistance < verticalHitDistance
      ? horizontalWallHitX
      : verticalWallHitX;
    this.wallHitY = horizontalHitDistance < verticalHitDistance
      ? horizontalWallHitY
      : verticalWallHitY;
    this.distance = horizontalHitDistance < verticalHitDistance
      ? horizontalHitDistance
      : verticalHitDistance
    this.wasHitVertical = verticalHitDistance < horizontalHitDistance;
  }

  render() {
    stroke("rgba(255, 0, 0, 0.3)");
    line(player.x, player.y, this.wallHitX, this.wallHitY);
    noStroke();
  }
}

const grid = new Map();
const player = new Player();
let rays = [];

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
  let rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

  for (let i = 0; i < NUM_RAYS; i++) {
    const ray = new Ray(rayAngle);
    ray.cast(columnIndex);
    rays.push(ray);

    rayAngle += FOV_ANGLE / NUM_RAYS;
    columnIndex++;
  }

}

function degToRad(a) {
  return a * (Math.PI / 180);
} 

function normalizeAngle(a) {
  a = a % (2 * Math.PI);
  if (a < 0)
    a = (2 * Math.PI) + a;

  return a;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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