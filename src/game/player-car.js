const Car = require('./car');

class PlayerCar extends Car {
  draw (game) {
    super.respondToEvents(game, game.keysDown);
    super.calculate(game);

    // add velocity

    this.x -= this.vx;
    this.y -= this.vy;

    // draw

    super.draw(game, game.viewport.centre.x, game.viewport.centre.y);
  }
}

module.exports = PlayerCar;
