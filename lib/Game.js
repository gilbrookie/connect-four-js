const { Board } = require('./Board');
const { RedTileBuilder, YellowTileBuilder } = require('./Tile');
const { WinningTileChecker } = require('./WinningTileChecker');
const { Player } = require('./Player');

class Game {
  constructor(columns = 8, rows = 8) {
    this.board = new Board(columns, rows);
    this.isGameOver = false;
    this.players = [
      new Player('Player1', new RedTileBuilder()),
      new Player('Player2', new YellowTileBuilder()),
    ];
    this.winningTileChecker = new WinningTileChecker(this.board);
  }
}

module.exports = { Game };
