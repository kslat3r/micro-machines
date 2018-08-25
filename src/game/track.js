/* global Image */

class Track {
  constructor (opts) {
    this.name = opts.name;
    this.imageLocation = opts.imageLocation;
    this.height = opts.height;
    this.width = opts.width;
    this.startPositions = opts.startPositions;
    this.startAngle = opts.startAngle;
    this.laps = opts.laps;
    this.tangents = opts.tangents;

    // image

    this.img = new Image();
    this.img.src = this.imageLocation;
  }

  drawTangents (game) {
    game.canvas.context.save();
    game.canvas.context.beginPath();

    // plot horizontal lines

    this.tangents.forEach((tangent) => {
      game.canvas.context.moveTo(game.viewport.x + tangent.x1, game.viewport.y + tangent.y1);
      game.canvas.context.lineTo(game.viewport.x + tangent.x2, game.viewport.y + tangent.y2);

      game.canvas.context.lineWidth = 3;
      game.canvas.context.strokeStyle = 'pink';
      game.canvas.context.stroke();
    });

    game.canvas.context.restore();
  }

  draw (game) {
    game.canvas.context.save();
    game.canvas.context.drawImage(this.img, game.viewport.x, game.viewport.y);
    game.canvas.context.restore();
  }
}

module.exports = Track;
