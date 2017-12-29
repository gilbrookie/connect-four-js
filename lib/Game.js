const readlineSync = require('readline-sync');

const { RED_TILE, YELLOW_TILE, STATUS, DIRECTION } = require('./utils');
const { Board } = require('./Board');
const { WinningTileChecker } = require('./WinningTileChecker');


class Game {
  constructor() {
    this.board = new Board(8, 8);
    this.isGameOver = false;
    this.players = [
      { name: 'Player1', tile: RED_TILE },
      { name: 'Player2', tile: YELLOW_TILE },
    ];
    this.winningTileChecker = new WinningTileChecker(this.board);
  }
}

module.exports = { Game };
