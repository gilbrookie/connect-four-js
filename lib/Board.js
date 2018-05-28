import { EMPTY, STATUS, TILE_WIDTH, buildResponse } from './utils';

class Board {
  constructor(columns, rows) {
    this.board = [];
    this.playedTiles = [];

    if (!columns || !rows) {
      throw new Error('Invalid data, missing column/row value in Board constructor');
    }

    // initialize the board data with zeros
    for(let i = 0; i < columns; i++) {
      this.board[i] = [];
      for(let j = 0; j < rows; j++) {
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

  isEmptySpace(column, row) {
    if (!(row || column)) { return false; }
    // console.log(`col: ${column}, row: ${row}, value: ${this.board[column][row]}`);
    if (this.board[column][row] === 0) {
      return true;
    }
    return false;
  }

  isValid(column, row) {
    // Boundary checks for the board
    // Top of the board, bottom of the board
    if (!this.board[column] || column < 0) {
        // console.log('Column Boundary check failed');
      return false;
    }

    // Min/Max columns
    if (row > 0 || row <= this.board.length) {
      // console.log(`Row Boundary check failed row: ${row}, ${this.board.length}`);
      return false;
    }
    return true;
  }

  isPlayable(column, row) {

    if (!row && isNaN(row) && !column && isNaN(column)) {
      return false;
    }

    if (column === 0 && this.board[column]) {
      return true;
    }
    // is the current space open AND does the space below the current position have a piece
    if (this.isEmptySpace(column, row)
        && (this.board[column - 1][row] !== 0)) {
      // console.log('isEmptySpace=true');
      return true;
    }

    // otherwise
    return this.isValid(row, column);
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
    console.log(playedTile);
    const res = this.playTile(col, playedTile.value);

    if (res.status === STATUS.OK) {
      playedTile.setRow(res.x);
      playedTile.setColumn(res.y);
      this.playedTiles.push(playedTile);
    }
    return res;
  }

  playTileCls(column, tileCls) {
    console.log(tileCls);
    const tile = new tileCls();
    tile.setColumn(parseInt(column, 10));
    tile.setRow(this.findCurrentRow(column));
    return this.playTileObj(column, tile);
  }

  printBoard() {
    // console.log(this.board);
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

export default { Board };
