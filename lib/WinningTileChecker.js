const { STATUS, DIRECTION } = require('./utils');

class WinningTileChecker {
  constructor(board) {
    this.board = board;
    this.rules = {
      winningCount: 4,
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

  isWinner(x, y, player) {
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

      return true;
    }
    return false;
  }
}

module.exports = { WinningTileChecker };
