const tracks = require('./tracks');
const cars = require('./cars');
const Canvas = require('../lib/canvas');
const Track = require('./track');
const PlayerCar = require('./player-car');
const AICar = require('./ai-car');
const Viewport = require('../lib/viewport');

class Game {
  constructor () {
    this.drawGrid = false;
    this.clickedStrs = false;
    this.drawTangents = true;

    this.tickInterval = 60;
    this.cellWidth = 10;
    this.cellHeight = 10;

    this.timer = null;
    this.canvas = null;
    this.viewport = null;
    this.objects = [];

    this.keys = {
      left: 65,
      right: 68,
      accelerate: 87,
      brake: 83,
      handbrake: 32
    };

    this.keysDown = {
      left: false,
      right: false,
      accelerate: false,
      brake: false,
      handbrake: false
    };

    this.friction = 0.82;
  }

  bindEvents () {
    // keydown events

    document.addEventListener('keydown', (e) => {
      if (e.keyCode === this.keys.accelerate || e.keyCode === this.keys.brake || e.keyCode === this.keys.left || e.keyCode === this.keys.right || e.keyCode === this.keys.handbrake) {
        e.preventDefault();
      }

      // left

      if (e.keyCode === this.keys.left) {
        this.keysDown.left = true;
      }

      // right

      if (e.keyCode === this.keys.right) {
        this.keysDown.right = true;
      }

      // up

      if (e.keyCode === this.keys.accelerate) {
        this.keysDown.accelerate = true;
      }

      // down

      if (e.keyCode === this.keys.brake) {
        this.keysDown.brake = true;
      }

      // slide

      if (e.keyCode === this.keys.handbrake) {
        this.keysDown.handbrake = true;
      }
    });

    // keyup events

    document.addEventListener('keyup', (e) => {
      if (e.keyCode === this.keys.left || e.keyCode === this.keys.right || e.keyCode === this.keys.accelerate || e.keyCode === this.keys.brake || e.keyCode === this.keys.handbrake) {
        e.preventDefault();
      }

      // left

      if (e.keyCode === this.keys.left) {
        this.keysDown.left = false;
      }

      // right

      if (e.keyCode === this.keys.right) {
        this.keysDown.right = false;
      }

      // up

      if (e.keyCode === this.keys.accelerate) {
        this.keysDown.accelerate = false;
      }

      // down

      if (e.keyCode === this.keys.brake) {
        this.keysDown.brake = false;
      }

      // slide

      if (e.keyCode === this.keys.handbrake) {
        this.keysDown.handbrake = false;
      }
    });
  }

  tick () {
    // clear canvas

    this.canvas.clear();

    // draw objects

    this.objects.forEach(obj => obj.draw(this));

    // draw viewport

    this.viewport.draw(this);

    // draw grid

    if (this.drawGrid) {
      this.viewport.drawGrid(this);
    }

    // draw tangents?

    if (this.drawTangents) {
      this.objects[0].drawTangents(this);
    }
  }

  start () {
    // create canvas object

    this.canvas = new Canvas(document.getElementById('canvas'));

    // add objects

    const track = new Track(tracks.sand);

    this.objects.push(track);

    this.objects.push(new PlayerCar(Object.assign({}, cars.yellowSport, {
      x: track.startPositions[0].x,
      y: track.startPositions[0].y,
      angle: track.startAngle
    })));

    this.objects.push(new AICar(Object.assign({}, cars.greenSport, {
      x: track.startPositions[1].x,
      y: track.startPositions[1].y,
      angle: track.startAngle,
      tangents: track.tangents
    })));

    // create viewport object

    this.viewport = new Viewport({
      height: this.canvas.height,
      width: this.canvas.width,
      margin: 50
    });

    // bind events

    this.bindEvents();

    // run internal ticker

    this.timer = setInterval(() => {
      this.tick();
    }, this.tickInterval);
  }
}

module.exports = Game;
