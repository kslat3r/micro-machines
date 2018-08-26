(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Canvas = require('../lib/canvas');
const Viewport = require('../lib/viewport');

class Game {
  constructor () {
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
  }

  start () {
    // create canvas object

    this.canvas = new Canvas(document.getElementById('canvas'));

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

},{"../lib/canvas":2,"../lib/viewport":3}],2:[function(require,module,exports){
class Canvas {
  constructor (elem) {
    this.elem = elem;
    this.height = elem.height;
    this.width = elem.width;
    this.context = elem.getContext('2d');
  }

  clear () {
    this.elem.height = this.elem.height;
    this.elem.width = this.elem.width;
  }
}

module.exports = Canvas;

},{}],3:[function(require,module,exports){
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

  draw () {

  }
}

module.exports = Viewport;

},{}],4:[function(require,module,exports){
const Game = require('./game');

document.addEventListener('DOMContentLoaded', () => {
  new Game().start();
});

},{"./game":1}]},{},[4]);
