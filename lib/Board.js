const { EMPTY, STATUS, buildResponse } = require('./utils');

class Board {
  constructor(x, y) {
    this.board = [];
    // initialize the board data with zeros
    for(let i = 0; i < x; i++) {
      this.board[i] = [];
      for(let j = 0; j < y; j++) {
        this.board[i][j] = EMPTY;
      }
    }
  }

  get() {
    return this.board;
  }

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

  printBoard() {
    const output = this.board.slice(0);
    console.log('');
    console.log("[" + output.reverse().join("],\n[") + "]");
    console.log('');
  }
}

module.exports = { Board };
