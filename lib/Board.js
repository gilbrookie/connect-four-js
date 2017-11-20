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

  checkRow(row) {
    let count = 0;
    let currentRow = this.board[row];

    for(let i = 0; i < currentRow.length; i++) {
      console.log('CurrentRow', currentRow[i]);

      count += currentRow[i];

      console.log('Count', count);
      if (count === 4 || count === -4 ) {
        console.log('WINNER WINNER WINNER');
        return true;
      }
      // reset the count when we hit a different color or empty space
      // FIXME: Fix logic to reset the count
      if (this.isEmptySpace(row, i)) {
        count = 0;
      }
      if (count > 0 && currentRow[i] < 0) {
        count = 0;
      }
      if (count < 0 && currentRow[i] > 0) {
        count = 0;
      }
    }
    return false;
  }

  checkColumn(col) {
    let count = 0;
    console.log(this.board.length);
    for (let i = 0; this.board.length; i++) {
      let currentCol = this.board[i][col];
      count += currentCol;
      console.log('Count:', count);
      if (count === 4 || count === -4 ) {
        console.log('WINNER!! WINNER!! WINNER!!');
        return true;
      }

      if (this.isEmptySpace(i, col)) {
        count = 0;
        break;
      }
      if (count > 0 && currentCol < 0) {
        count = 0;
      }
      if (count < 0 && currentCol > 0) {
        count = 0;
      }
      if (this.isPlayable(i, col)) {
        console.log('Have a Winner on column', i);
      }
    }
    return false;
  }

  checkDiagLeft(row, col) {}
  checkDiagRight(row, col) {}

  // Given a current board configuration, find any spaces that could be a winning space
  findWinners() {}


  // public methods
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
