const colour = require('./colours');
const { TILE_WIDTH } = require('./utils');

class Tile {
  constructor(pos) {
    // x, y represents pixel coordinates on screen
    this.x = pos && pos.x;
    this.y = pos && pos.y;

    // r represents the radius of the tile
    this.r = pos && pos.r;

    // when played, row and column represent its location on a board.
    // they will be undefined until the tile is played.
    this.row = pos && pos.row;
    this.column = pos && pos.row;

    if (this.row) {
      this.x = this.row*TILE_WIDTH + TILE_WIDTH/2;
    }

    if (this.column) {
      this.y = this.column*TILE_WIDTH + TILE_WIDTH/2;
    }
  }

  // Setters methods.
  // When either of these are called, the object's coordinates
  // will get locked because the tile has been "played".
  setRow(row) {
    this.row = row;
    this.x = row*TILE_WIDTH + TILE_WIDTH/2;
  }

  setColumn(column) {
    this.column = column;
    this.y = column*TILE_WIDTH + TILE_WIDTH/2;
  }

  // draw method
  draw(p) {
    p.push();
    p.fill(this.colour);
    p.ellipse(this.x, this.y, this.r);
    p.pop();
  }
}

class RedTile extends Tile {
  constructor(pos) {
    super(pos);
    this.colour = colour.red;
    this.value = 1;
  }
}

class YellowTile extends Tile {
  constructor(pos) {
    super(pos);
    this.colour = colour.yellow;
    this.value = -1;
  }
}

class YellowTileBuilder {
  constructor () {}
  build(opts) {
    return new YellowTile(opts);
  }
}

class RedTileBuilder {
  constructor() {}
  build(opts) {
    return new RedTile(opts);
  }
}

module.exports = { RedTileBuilder, YellowTileBuilder };
