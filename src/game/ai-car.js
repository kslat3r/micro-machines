const Car = require('./car');
const intersects = require('../helpers/intersects');

class AICar extends Car {
  constructor (opts) {
    super(opts);

    this.tangentIndex = 0;
    this.tangents = opts.tangents;
    this.path = [];
    this.keysDown = {
      accelerate: false,
      brake: false,
      left: false,
      right: false,
      handbrake: false
    };
  }

  drive (game) {
    // where is next tangent

    const tangent = this.tangents[this.tangentIndex];

    // get midpoint of tangent

    const midpoint = {
      x: ((tangent.x1 + tangent.x2) / 2),
      y: ((tangent.y1 + tangent.y2) / 2)
    };

    // get distance

    // const xd = (this.x + game.viewport.x) - (midpoint.x + game.viewport.x);
    // const yd = (this.y + game.viewport.y) - (midpoint.y + game.viewport.y);
    // const distance = Math.sqrt((xd * xd) + (yd * yd));

    // draw line between current point and midpoint

    if (game.debug) {
      game.canvas.context.save();
      game.canvas.context.beginPath();
      game.canvas.context.moveTo(this.x + game.viewport.x, this.y + game.viewport.y);
      game.canvas.context.lineTo(midpoint.x + game.viewport.x, midpoint.y + game.viewport.y);
      game.canvas.context.lineWidth = 1;
      game.canvas.context.strokeStyle = 'green';
      game.canvas.context.stroke();
      game.canvas.context.restore();
    }

    // find angle from current point to new point & diff

    const angle = Math.atan2(midpoint.y - this.y, midpoint.x - this.x) * (180 / Math.PI);
    const angleDiff = Math.atan2(Math.sin((angle - this.angle) * Math.PI / 180), Math.cos((angle - this.angle) * (180 / Math.PI)));

    // reset keypresses

    this.keysDown = {
      accelerate: false,
      brake: false,
      left: false,
      right: false,
      handbrake: false
    };

    // steering

    if (Math.abs((this.angle - angle) - (this.laps * 360)) > this.handling) {
      if (angleDiff > 0) {
        this.keysDown.right = true;
      } else {
        this.keysDown.left = true;
      }
    }

    this.angle = angle * (180 / Math.PI);

    // acceleration

    this.keysDown.accelerate = true;
  }

  draw (game) {
    // call ai method

    this.drive(game);

    super.respondToEvents(game, this.keysDown);
    super.calculate(game);

    if (game.viewport.within(game, this.x + game.viewport.x, this.y + game.viewport.y, true)) {
      super.draw(game, this.x + game.viewport.x, this.y + game.viewport.y);
    }

    // has car crossed line

    const tangent = this.tangents[this.tangentIndex];

    const A = {
      x: this.prev_x - this.width + game.viewport.x,
      y: this.prev_y - this.width + game.viewport.y
    };

    const B = {
      x: this.x - this.width + game.viewport.x,
      y: this.y - this.width + game.viewport.y
    };

    const C = {
      x: tangent.x1 + game.viewport.x,
      y: tangent.y1 + game.viewport.y
    };

    var D = {
      x: tangent.x2 + game.viewport.x,
      y: tangent.y2 + game.viewport.y
    };

    if (intersects(A, B, C, D)) {
      if (this.tangentIndex < (this.tangents.length - 1)) {
        this.i++;
      } else {
        this.i = 0;
      }
    }
  }
}

module.exports = AICar;
