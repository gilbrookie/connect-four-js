const { EMPTY, STATUS, TILE_WIDTH, buildResponse } = require('./utils');

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

  findCurrentRow(col) {
    for (let i = 0; i < this.board.length; i++) {
      if (this.isEmptySpace(col, i)) { return i }
    }
  }

  // Check if the current space is empty
  isEmptySpace(column, row) {
    if (this.board[column] && this.board[column][row] === EMPTY) {
      return true;
    }
    return false;
  }

  // Boundary checks on the board
  isValid(column, row) {
    // Top of the board, bottom of the board
    if (!this.board[column]) {
      return false;
    }

    // Min/Max row
    if (row >= 0 && row <= this.board[column].length) {
      return true;
    }
    return false;
  }

  // Validates the playability of the piece - can it be placed in the destination
  isPlayable(column, row) {
    // Basic validation - fail quickly
    if (!row && isNaN(row) && !column && isNaN(column)) {
      return false;
    }

    console.log(`--> isPlayable(${column}, ${row})`)
    // is the current space open
    // AND Is it on the bottom column OR if not on the bottom ,does the space below the
    // current position have a piece
    if (this.isEmptySpace(column, row)
      && ((column === EMPTY && this.board[column]) || (this.board[column - 1][row] !== EMPTY))) {
      return true;
    }

    // otherwise
    return this.isValid(column, row);
  }

  playTile(col, value) {
    let column = parseInt(col, 10);

    // Boundary check for the column value
    if ( column >= this.board.length || column < 0 || isNaN(column)) {
      return buildResponse(STATUS.INVALID_ENTRY, -1, column);
    }
    const row = this.findCurrentRow(column);

    console.log(`Destination ${column}: ${row}`);
    if (!this.isPlayable(column, row)) {
      return buildResponse(STATUS.INVALID_ENTRY, row, column);
    }

    this.board[column][row] = value;
    console.log(`played tile [${value}] at x:${row}, y:${column}`);
    return buildResponse(STATUS.OK, column, row);
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
    this.board.forEach(col => {
      console.log(col);
    });

    console.log ('---------------')
    this.transpose().reverse().forEach(col => {
      console.log(col);
    });

  }

  transpose() {
    return this.board.map((col, i) => this.board.map(row => row[i]));
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
