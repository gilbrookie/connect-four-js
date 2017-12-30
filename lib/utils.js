
const RED_TILE = 1;
const YELLOW_TILE = -1;
const EMPTY = 0;

const TILE_WIDTH=100;

const RED_TILE_COLOUR = '#FF0000';
const YELLOW_TILE_COLOUR = '#FFFF00';

const STATUS = {
  OK: 0,
  INVALID_ENTRY: 1,
};

const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  DIAG_UP_RIGHT: 'DIAG_UP_RIGHT',
  DIAG_DOWN_RIGHT: 'DIAG_DOWN_RIGHT',
  DIAG_UP_LEFT: 'DIAG_UP_LEFT',
  DIAG_DOWN_LEFT: 'DIAG_DOWN_LEFT',
};

class Response {
  constructor(status, x = -1, y = -1) {
    this.x = x;
    this.y = y;
    this.status = status;
  }
}

function buildResponse(status, x, y) {
  return new Response(status, x, y);
}

module.exports = {
  RED_TILE,
  RED_TILE_COLOUR,
  YELLOW_TILE,
  YELLOW_TILE_COLOUR,
  TILE_WIDTH,
  EMPTY,
  STATUS,
  DIRECTION,
  buildResponse,
};
