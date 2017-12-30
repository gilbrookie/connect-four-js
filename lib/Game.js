const { Board } = require('./Board');
const { RedTile, YellowTile } = require('./Tile');
const { WinningTileChecker } = require('./WinningTileChecker');


class Game {
  constructor(x = 8, y = 8) {
    this.board = new Board(x, y);
    this.isGameOver = false;
    this.players = [
      { name: 'Player1', tile: RedTile },
      { name: 'Player2', tile: YellowTile },
    ];
    this.winningTileChecker = new WinningTileChecker(this.board);
  }
}

module.exports = { Game };
