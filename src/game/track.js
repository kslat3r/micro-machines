/* global Image */

class Track {
  constructor (opts) {
    this.name = opts.name;
    this.imageLocation = opts.imageLocation;
    this.height = opts.height;
    this.width = opts.width;
    this.startPositions = opts.startPositions;
    this.startAngle = opts.startAngle;
    this.recordedPositions = opts.recordedPositions;

    // image

    this.img = new Image();
    this.img.src = this.imageLocation;
  }

  draw (game) {
    game.canvas.context.save();
    game.canvas.context.drawImage(this.img, game.viewport.x, game.viewport.y);
    game.canvas.context.restore();
  }
}

module.exports = Track;
