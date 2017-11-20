const readlineSync = require('readline-sync');

const { RED_TILE, YELLOW_TILE, STATUS, DIRECTION } = require('./utils');
const { Board } = require('./Board');


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
    const input = readlineSync.question('Please place a tile in a column : ');

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

module.exports = Game;
