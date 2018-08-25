const Car = require('./car');

class AICar extends Car {
  constructor (opts) {
    super(opts);

    this.recordedPositions = opts.recordedPositions;
    this.recordedPositionIndex = 0;
  }

  draw (game) {
    const recordedPosition = this.recordedPositions[this.recordedPositionIndex];

    this.x = (recordedPosition.x - (game.viewport.width / 2)) * -1;
    this.y = (recordedPosition.y - (game.viewport.height / 2)) * -1;
    this.angle = recordedPosition.angle;

    // draw

    super.draw(game, this.x + game.viewport.x, this.y + game.viewport.y);

    // increment position

    if (this.recordedPositionIndex === (this.recordedPositions.length - 1)) {
      this.recordedPositionIndex = 10;
    } else {
      this.recordedPositionIndex++;
    }
  }
}

module.exports = AICar;
