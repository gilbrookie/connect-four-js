const { WebGame } = require('./lib/WebGame');
const p5 = require('p5');

const game = new WebGame(6, 7);
new p5(game.start.bind(game), 'gameCanvas');
