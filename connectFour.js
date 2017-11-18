const readlineSync = require('readline-sync');

const RED_TILE = 1;
const YELLOW_TILE = -1;
const EMPTY = 0;

const STATUS = {
  OK: 0,
  INVALID_ENTRY: 1,
}

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

class Game {
  constructor() {
    this.board = new Board(8, 8);
    this.isGameOver = false;
    this.rules = {
      winningCount: 4,
    }
    this.players = [
      { name: 'Player1', tile: RED_TILE },
      { name: 'Player2', tile: YELLOW_TILE },
    ];
  }

  playTurn(player) {
    this.board.printBoard();
    console.log(player);
    const input = readlineSync.prompt('Please place a tile in a column : ');

    if(input === '') {
      console.log('A tile can not be placed there, please try again');
      this.playTurn(player);
    }

    let res = this.board.playTile(input, player.tile);

    if (res.status === STATUS.INVALID_ENTRY) {
      console.log('A tile can not be placed there, please try again');
      this.playTurn(player);
    }

    if (res.status === STATUS.OK) {
      this.calculateWinner(res.x, res.y, player);
    }
  }

  checkNextTile(x, y, direction) {
    // get a snapshot of the board;
    const _b = this.board.get();
    const startValue = _b[x][y];
    let nextValue;
    let count = 0;
    let row = x;
    let col = y;

    while (true) {
      switch(direction) {
        case DIRECTION.LEFT:
          col = col - 1;
          break;

        case DIRECTION.RIGHT:
          col = col + 1;
          break;

        case DIRECTION.UP:
          row = row + 1;
          break;

        case DIRECTION.DOWN:
          row = row - 1;
          break;

        case DIRECTION.DIAG_UP_RIGHT:
          col = col + 1;
          row = row + 1;
          break;

        case DIRECTION.DIAG_DOWN_LEFT:
          col = col - 1;
          row = row - 1;
          break;

        case DIRECTION.DIAG_UP_LEFT:
          col = col -1;
          row = row + 1;
          break;

        case DIRECTION.DIAG_DOWN_RIGHT:
          col = col + 1;
          row = row - 1;
          break;
      }

      if (!this.board.isValid(row, col)) {
        return count;
      }
      nextValue = _b[row][col];
      if (nextValue != startValue) {
        // exit the loop
        break;
      }
      count += 1;
      console.log(`==> count: ${count}, x: ${row}, y: ${col}, startValue: ${startValue}, nextValue: ${nextValue}`);
    }

    return count;
  }

  calculateWinner(x, y, player) {
    const countLeft = this.checkNextTile(x, y, DIRECTION.LEFT);
    const countRight = this.checkNextTile(x, y, DIRECTION.RIGHT);
    const rowCount = 1 + countLeft + countRight;
    console.log('ROW COUNT', rowCount);

    // for columns, we only need to do the downward direction - thanks gravity
    const countDown = this.checkNextTile(x, y, DIRECTION.DOWN);
    const colCount = 1 + countDown;
    console.log('COLUMN Count', colCount);

    const countDiagUpRight = this.checkNextTile(x, y, DIRECTION.DIAG_UP_RIGHT);
    const countDiagDownLeft = this.checkNextTile(x, y, DIRECTION.DIAG_DOWN_LEFT);
    const diagCount1 = 1 + countDiagDownLeft + countDiagUpRight;
    console.log('Diag count', diagCount1);

    const countDiagUpLeft = this.checkNextTile(x, y, DIRECTION.DIAG_UP_LEFT);
    const countDiagDownRight = this.checkNextTile(x, y, DIRECTION.DIAG_DOWN_RIGHT);
    const diagCount2 = 1 + countDiagDownRight + countDiagUpLeft;
    console.log('Diag count', diagCount2);

    if (rowCount === this.rules.winningCount ||
      colCount === this.rules.winningCount ||
      diagCount1 === this.rules.winningCount ||
      diagCount2 === this.rules.winningCount ) {

      console.log('\n******* GAME OVER *********');
      this.board.printBoard();
      console.log('\n****** WE HAVE A WINNER *******\n');
      console.log(`${player.name} wins the game!!!`);
      this.isGameOver = true;
    }
  }

  start() {
    while (!this.isGameOver) {
      for (let player of this.players) {
        if (this.isGameOver) { break; }
        this.playTurn(player);
        console.log('\n--> end turn <--');
      };
    }
  }
}

const game = new Game();
game.start();