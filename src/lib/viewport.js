const PlayerCar = require('../game/player-car');

class Viewport {
  constructor (opts) {
    this.x = 0;
    this.y = 0;

    this.height = opts.height;
    this.width = opts.width;
    this.margin = opts.margin;

    this.centre = {
      x: this.width / 2,
      y: this.height / 2
    };
  }

  draw (game) {
    // get player car

    const playerCar = game.objects.find(obj => obj instanceof PlayerCar);

    // centre

    if (playerCar) {
      this.x = playerCar.x;
      this.y = playerCar.y;
    }
  }

  drawGrid (game) {
    game.canvas.context.save();
    game.canvas.context.beginPath();

    // plot horizontal lines

    for (var i = 0; i < game.viewport.width; i += game.cell_width) {
      game.canvas.context.moveTo(i, 0);
      game.canvas.context.lineTo(i, game.viewport.height);
    }

    // plot vertical lines

    for (let i = 0; i < game.viewport.height; i += game.cell_height) {
      game.canvas.context.moveTo(0, i);
      game.canvas.context.lineTo(game.viewport.width, i);
    }

    // draw

    game.canvas.context.lineWidth = 1;
    game.canvas.context.strokeStyle = 'red';
    game.canvas.context.stroke();

    // plot centre

    game.canvas.context.beginPath();
    game.canvas.context.strokeStyle = 'black';
    game.canvas.context.arc(game.viewport.width / 2, game.viewport.height / 2, 2, 0, Math.PI * 2, true);
    game.canvas.context.closePath();

    // draw

    game.canvas.context.fill();
    game.canvas.context.restore();
  }

  within (game, x, y, margin) {
    if (!margin) {
      if (x > 0 && y > 0 && x < game.canvas.width && y < game.canvas.height) {
        return true;
      }

      return false;
    }

    if ((x + game.viewport.margin) > 0 && (y + game.viewport.margin) > 0 && x < (game.canvas.width + game.viewport.margin) && y < (game.canvas.height + game.viewport.margin)) {
      return true;
    }

    return false;
  }
}

module.exports = Viewport;
