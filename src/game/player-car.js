const Car = require('./car');

class PlayerCar extends Car {
  draw (game) {
    super.respondToEvents(game, game.keysDown);
    super.calculate(game);
    super.draw(game, game.viewport.centre.x, game.viewport.centre.y);
  }
}

module.exports = PlayerCar;
