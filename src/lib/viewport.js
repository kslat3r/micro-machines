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

  }
}

module.exports = Viewport;
