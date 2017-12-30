const colours = require('./colours');
const { Game } = require('./Game');
const { Tile } = require('./Tile');
const { TILE_WIDTH } = require('./utils');

class WebGame extends Game {
  constructor(x, y) {
    super(x, y);
    this.x = x;
    this.y = y;
    this.p;

    this.playerCount = 0;
    this.currentPlayer = this.players[this.playerCount];
    this.activeTile;
    this.playedTiles = [];

    this.board.printBoard();
  }

  setupP5() {
    this.p.frameRate(60);
    this.p.createCanvas(this.x*TILE_WIDTH, this.y*TILE_WIDTH);
    this.p.background(colours.white);
  }

  draw() {
    const p = this.p;
    p.push();
    p.background(colours.white);
    this.board.draw(p);
    this.board.getPlayedTiles().forEach((tile) => {
      tile.draw(p);
    })
    p.pop();
    p.push();
    let tileCls = this.currentPlayer.tile;
    this.activeTile = new tileCls({
      x: p.mouseX,
      y: p.mouseY,
      r: 80 });
    this.activeTile.draw(p);
    p.pop();
  }

  getNextPlayer() {
    console.log('Player Count', this.playerCount);
    if (this.playerCount === 0) {
      this.playerCount = 1;
    } else {
      this.playerCount = 0;
    }
    this.currentPlayer = this.players[this.playerCount];
    console.log('Current player', this.currentPlayer);
  }

  mousePressed() {
    const column = Math.floor(this.p.mouseX / TILE_WIDTH);
    console.log('Selected Column', column);
    const res = this.board.playTileObj(column, this.activeTile);
    // TODO:
    // If !res.status = STATUS.OK, flash the screen Red, dont change player
    // if (res.status === STATUS.OK {
    //   this.getNextPlayer();
    // })
    // Otherwise flash the background red to alert the player
    // their last move was not valid.
    this.getNextPlayer();
  }

  start(p) {
    this.p = p;
    this.p.setup = this.setupP5.bind(this);
    this.p.draw = this.draw.bind(this);
    this.p.mousePressed = this.mousePressed.bind(this);
  }
}

module.exports = { WebGame };
