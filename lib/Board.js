const { EMPTY, STATUS, TILE_WIDTH, buildResponse } = require('./utils');

class Board {
  constructor(x, y) {
    this.board = [];
    this.playedTiles = [];
    // initialize the board data with zeros
    for(let i = 0; i < x; i++) {
      this.board[i] = [];
      for(let j = 0; j < y; j++) {
        this.board[i][j] = EMPTY;
      }
    }
  }

  get() { return this.board; }
  getPlayedTiles() { return this.playedTiles; }

  // private methods
  findCurrentRow(col) {
    for (let i = 0; i < this.board.length; i++) {
      if (this.isEmptySpace(i, col)) { return i }
    }
  }

  isEmptySpace(x, y) {
    console.log(`x: ${x}, y: ${y}, value: ${this.board[x][y]}`);
    if (this.board[x][y] === 0) {
      return true;
    }
    return false;
  }

  isValid(x, y) {
    // Boundary checks for the board
    // Top of the board, bottom of the board
    if (!this.board[x] || x < 0) {
      return false;
    }

    // Min/Max columns
    if (y < 0 || y >= this.board.length) {
      return false;
    }
    return true;
  }

  isPlayable(x, y) {
    if (!this.isValid) {
      return false;
    }

    if (x === 0) {
      return true;
    }
    // is the current space open AND does the space below the current position have a piece
    if (this.isEmptySpace(x, y) && (this.board[x - 1][y] !== 0)) {
      return true;
    }

    // otherwise
    return false;
  }

  playTile(col, value) {
    let column = parseInt(col, 10);

    // Boundary check for the column value
    if ( column >= this.board.length || column < 0 || isNaN(column)) {
      return buildResponse(STATUS.INVALID_ENTRY, -1, column);
    }
    const row = this.findCurrentRow(column);

    if (!this.isPlayable(row, column)) {
      return buildResponse(STATUS.INVALID_ENTRY, row, column);
    }

    this.board[row][column] = value;
    console.log(`played tile [${value}] at x:${row}, y:${column}`);
    return buildResponse(STATUS.OK, row, column);
  }

  playTileObj(col, tileObj) {
    const playedTile = tileObj;
    const res = this.playTile(col, playedTile.value);
    if (res.status === STATUS.OK) {
      playedTile.setRow(res.x);
      playedTile.setColumn(res.y);
      this.playedTiles.push(playedTile);
    }
    return res;
  }

  printBoard() {
    console.log(this.board);
    const output = this.board.slice(0);
    console.log('');
    console.log("[" + output.reverse().join("],\n[") + "]");
    console.log('');
  }

  draw(p) {
    p.push();
    p.stroke('#000');
    p.background('#FFE');
    p.fill('#FFF');

    const outBoard = this.board.slice(0).reverse();

    for (let x = 0; x < outBoard.length; x++) {
      for (let y = 0; y < outBoard[x].length; y++) {
        if(p.mouseX >= x*TILE_WIDTH && p.mouseX <= x*TILE_WIDTH+TILE_WIDTH) {
          p.push();
          p.fill('#00FF00');
          p.rect(x*TILE_WIDTH, y*TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
          p.text(`(${x},${y})`, x*TILE_WIDTH, y*TILE_WIDTH);
          p.pop();
        } else {
          p.text(`(${x},${y})`, x*TILE_WIDTH, y*TILE_WIDTH);
          p.rect(x*TILE_WIDTH, y*TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
        }
      }
    }
    p.pop();
  }
}

module.exports = { Board };
