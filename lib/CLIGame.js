const readlineSync = require('readline-sync');

const { RED_TILE, YELLOW_TILE, STATUS, DIRECTION } = require('./utils');
const { Board } = require('./Board');
const { WinningTileChecker } = require('./WinningTileChecker');
const { Game } = require('./Game');

class CLIGame extends Game {
  constructor(columns, rows) {
    super();
  }

  playTurn(player) {
    this.board.printBoard();
    console.log(player);
    const input = readlineSync.question('Please place a tile in a column : ');

    if(input === '') {
      console.log('A tile can not be placed there, please try again');
      this.playTurn(player);
    }

    console.log('PLAYER', player);
    let res = this.board.playTileObj(input, player.getTile());

    if (res.status === STATUS.INVALID_ENTRY) {
      console.log('A tile can not be placed there, please try again');
      this.playTurn(player);
    }

    if (res.status === STATUS.OK) {
      if (this.winningTileChecker.isWinner(res.x, res.y, player)) {
        console.log('\n******* GAME OVER *********');
        this.board.printBoard();
        console.log('\n****** WE HAVE A WINNER *******\n');
        console.log(`${player.name} wins the game!!!`);
        this.isGameOver = true;
      }
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

module.exports = { CLIGame };
