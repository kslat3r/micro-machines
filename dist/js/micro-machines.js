(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../helpers/intersects":9,"./car":2}],2:[function(require,module,exports){
/* global Image */

class Car {
  constructor (opts) {
    this.name = opts.name;

    this.height = opts.height;
    this.width = opts.width;

    this.acceleration = opts.acceleration;
    this.braking = opts.braking;
    this.handling = opts.handling;
    this.maxPower = opts.maxPower;
    this.handbrake = opts.handbrake;

    this.img = new Image();
    this.img.src = opts.imageLocation;

    this.x = opts.x;
    this.y = opts.y;
    this.prevX = 0;
    this.prevY = 0;
    this.angle = opts.angle;
    this.vx = 0;
    this.vy = 0;
    this.power = 0;
    this.steering = 0;
  }

  respondToEvents (game, keysDown) {
    // steer left?

    if (keysDown.left) {
      this.angle -= this.steering;
    }

    // steer right?

    if (keysDown.right) {
      this.angle += this.steering;
    }

    // accelerate?

    if (keysDown.accelerate && !keysDown.brake) {
      if (this.power < this.maxPower) {
        this.power += this.acceleration;
      }
    }

    // decelerate?

    if ((keysDown.accelerate && keysDown.brake) || (!keysDown.accelerate && !keysDown.brake)) {
      this.power *= game.friction;
    }

    // brake/reverse?

    if (keysDown.brake && !keysDown.accelerate) {
      if (this.power > (this.maxPower * -1)) {
        this.power -= this.braking;
      }
    }

    // handbrake

    if (keysDown.handbrake && !keysDown.left && !keysDown.right) {
      if (this.power > 0) {
        this.power -= this.handbrake;
      }

      // handbrake is not reverse

      if (this.power < 0) {
        this.power = 0;
      }
    }

    // decrease angle if i'm sliding left

    if (keysDown.handbrake && keysDown.left) {
      this.angle -= this.steering * 0.5;
    }

    // increase angle if i'm sliding right

    if (keysDown.handbrake && keysDown.right) {
      this.angle += this.steering * 0.5;
    }
  }

  calculate (game) {
    // record prev x/y

    this.prevX = this.x;
    this.prevY = this.y;

    // get dx/dy

    const dx = Math.cos(this.angle * (Math.PI / 180));
    const dy = Math.sin(this.angle * (Math.PI / 180));

    // add power to velocity to get new point

    this.vx += dx * this.power;
    this.vy += dy * this.power;

    // apply friction with grip

    const grip = Math.abs(Math.atan2(this.y - this.vy, this.x - this.vx)) * 0.01;

    this.vx *= game.friction - grip;
    this.vy *= game.friction - grip;

    // turn quicker when going faster

    this.steering = (this.handling * (Math.abs(this.power) / this.maxPower));

    // add velocity

    this.x -= this.vx;
    this.y -= this.vy;
  }

  draw (game, x, y) {
    // save state

    game.canvas.context.save();

    // translate to centre & perform rotation

    game.canvas.context.translate(x, y);
    game.canvas.context.rotate(this.angle * (Math.PI / 180));

    // draw on middle of canvas

    game.canvas.context.drawImage(this.img, 0 - (this.width / 2), 0 - (this.height / 2));

    // restore state

    game.canvas.context.restore();
  }
}

module.exports = Car;

},{}],3:[function(require,module,exports){
module.exports = {
  yellowSport: {
    name: 'Yellow sport',
    imageLocation: './images/cars/yellow_sport.png',
    height: 14,
    width: 25,
    maxPower: 5,
    acceleration: 1,
    braking: 0.25,
    handling: 10,
    handbrake: 2
  },
  greenSport: {
    name: 'Green sport',
    imageLocation: './images/cars/green_sport.png',
    height: 14,
    width: 25,
    maxPower: 5,
    acceleration: 1,
    braking: 0.25,
    handling: 10,
    handbrake: 2
  }
};

},{}],4:[function(require,module,exports){
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

},{"../lib/canvas":10,"../lib/viewport":11,"./ai-car":1,"./cars":3,"./player-car":5,"./track":6,"./tracks":7}],5:[function(require,module,exports){
const Car = require('./car');

class PlayerCar extends Car {
  draw (game) {
    super.respondToEvents(game, game.keysDown);
    super.calculate(game);
    super.draw(game, game.viewport.centre.x, game.viewport.centre.y);
  }
}

module.exports = PlayerCar;

},{"./car":2}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
module.exports = {
  sand: {
    name: 'Sand',
    imageLocation: './images/tracks/sand.png',
    height: 1760,
    width: 1728,
    startPositions: [
      {
        x: 38,
        y: -467
      },
      {
        x: 358,
        y: 741
      }
    ],
    startAngle: -90,
    laps: 10,
    tangents: [
      {
        x1: 291.9209687142402,
        y1: 675.6774390969817,
        x2: 376.95445170777657,
        y2: 677.7395651246833
      },
      {
        x1: 295.15052423632176,
        y1: 423.5525595463723,
        x2: 378.95758631599745,
        y2: 385.26712311563693
      },
      {
        x1: 222.94777898185862,
        y1: 349.252767938125,
        x2: 324.9476630495409,
        y2: 328.25259944422385
      },
      {
        x1: 275.0418731984727,
        y1: 226.9803775480545,
        x2: 337.94651061499576,
        y2: 243.4000013701512
      },
      {
        x1: 319.8911497032895,
        y1: 132.32012730163055,
        x2: 384.88974572708776,
        y2: 219.31810166137495
      },
      {
        x1: 643.2258427548567,
        y1: 133.59958596839928,
        x2: 643.9951672478139,
        y2: 215.7420793311355
      },
      {
        x1: 1214.546012118808,
        y1: 149.22110728871445,
        x2: 1205.6195759423463,
        y2: 217.35664507673113
      },
      {
        x1: 1355.0992047904388,
        y1: 145.8143607425375,
        x2: 1353.6259939611498,
        y2: 220.88101900529477
      },
      {
        x1: 1450.6429061589608,
        y1: 174.88315902219375,
        x2: 1435.6432256631397,
        y2: 218.88319945125866
      },
      {
        x1: 1577.1799918658735,
        y1: 277.90978586792085,
        x2: 1540.0672996467708,
        y2: 325.1179633941136
      },
      {
        x1: 1541.4277251357573,
        y1: 325.11503349842974,
        x2: 1623.8812615821691,
        y2: 327.53910365114484
      },
      {
        x1: 1545.045236051546,
        y1: 538.4166662868597,
        x2: 1628.9778506566186,
        y2: 543.7206395791437
      },
      {
        x1: 1540.9756323400109,
        y1: 577.7303368317172,
        x2: 1625.9755954285963,
        y2: 611.7304958147176
      },
      {
        x1: 1501.9755947253266,
        y1: 631.7304988254532,
        x2: 1534.975594696184,
        y2: 703.7304989499089
      },
      {
        x1: 1402.8117837675336,
        y1: 651.2164758779057,
        x2: 1431.192162676965,
        y2: 705.8836731639503
      },
      {
        x1: 1343.1241538170675,
        y1: 702.9565412640627,
        x2: 1374.1206268160458,
        y2: 763.9603089980274
      },
      {
        x1: 1225.8845214180703,
        y1: 744.7775536932008,
        x2: 1233.9470573256174,
        y2: 765.3673734247623
      },
      {
        x1: 1132.7607030597596,
        y1: 811.325922490341,
        x2: 1179.7605055717559,
        y2: 816.3258767730963
      },
      {
        x1: 1097.760492252916,
        y1: 869.3258736717623,
        x2: 1181.7604921415723,
        y2: 840.3258736457103
      },
      {
        x1: 1186.187146256671,
        y1: 963.778416149346,
        x2: 1244.1658879642691,
        y2: 902.7808418697156
      },
      {
        x1: 1278.1660384131258,
        y1: 989.8414087215567,
        x2: 1322.1660777228183,
        y2: 903.8441254171066
      },
      {
        x1: 1374.704672951856,
        y1: 1080.8664573590452,
        x2: 1428.4121788694024,
        y2: 1016.2567206142696
      },
      {
        x1: 1489.1034612585918,
        y1: 1153.9187314339697,
        x2: 1568.6453580985599,
        y2: 1066.3466099366665
      },
      {
        x1: 1542.660501941355,
        y1: 1188.3585674234653,
        x2: 1627.6607532505564,
        y2: 1120.3587658556867
      },
      {
        x1: 1540.6607646418388,
        y1: 1250.358774850174,
        x2: 1626.660764661932,
        y2: 1250.3587748660395
      },
      {
        x1: 1544.5565206925853,
        y1: 1338.18979849762,
        x2: 1631.7139226005993,
        y2: 1343.586431389372
      },
      {
        x1: 1543.714881550396,
        y1: 1412.582775940257,
        x2: 1619.7148842456293,
        y2: 1411.5827656859587
      },
      {
        x1: 1540.7148843256173,
        y1: 1499.582765381793,
        x2: 1631.7148843258983,
        y2: 1499.5827653807228
      },
      {
        x1: 1538.6795491277821,
        y1: 1542.0519190809987,
        x2: 1631.256802623854,
        y2: 1603.6089606162002
      },
      {
        x1: 1476.2730748495446,
        y1: 1567.5962385454898,
        x2: 1480.2731064087209,
        y2: 1654.5962135964796
      },
      {
        x1: 1381.2731071757726,
        y1: 1547.5962129884306,
        x2: 1327.2731071787168,
        y2: 1613.5962129860923
      },
      {
        x1: 1253.2514241345768,
        y1: 1417.68564549694,
        x2: 1201.377677690834,
        y2: 1487.5154328328363
      },
      {
        x1: 1146.3643292474057,
        y1: 1337.512995410844,
        x2: 1148.363928239815,
        y2: 1375.5129239075388
      },
      {
        x1: 1061.3639107588046,
        y1: 1336.5129208273177,
        x2: 1063.3639100491077,
        y2: 1375.512920703135
      },
      {
        x1: 953.1355149066311,
        y1: 1427.1786047187136,
        x2: 983.3383929751623,
        y2: 1478.6356007168001
      },
      {
        x1: 865.2747544627198,
        y1: 1497.6882867978284,
        x2: 952.2733983248171,
        y2: 1542.6894205105439
      },
      {
        x1: 833.2733648533297,
        y1: 1568.6894486198805,
        x2: 922.2733642255752,
        y2: 1572.6894491483986
      },
      {
        x1: 767.3876387982233,
        y1: 1573.7937340446317,
        x2: 741.1352891355514,
        y2: 1659.3575901721463
      },
      {
        x1: 640.1283661192966,
        y1: 1572.34527488363,
        x2: 731.1282532166473,
        y2: 1538.3450710535806
      },
      {
        x1: 630.5658554618637,
        y1: 1488.2626144340018,
        x2: 687.618523568724,
        y2: 1429.5194349562078
      },
      {
        x1: 573.5577882304361,
        y1: 1435.407676240969,
        x2: 597.5550379160627,
        y2: 1406.4026154047317
      },
      {
        x1: 479.554747342562,
        y1: 1425.4020807222548,
        x2: 451.55473718495267,
        y2: 1344.4020620313015
      },
      {
        x1: 445.5547363276122,
        y1: 1473.4020604537154,
        x2: 356.5547363215305,
        y2: 1440.4020604425245
      },
      {
        x1: 372.5547363213159,
        y1: 1529.4020604421298,
        x2: 436.5547363213111,
        y2: 1525.402060442121
      },
      {
        x1: 399.5697935879832,
        y1: 1639.728279920305,
        x2: 350.16355595215896,
        y2: 1536.27677323335
      },
      {
        x1: 273.1492142368002,
        y1: 1605.2967778032162,
        x2: 308.1490063385767,
        y2: 1536.297073174478
      },
      {
        x1: 231.14899995269303,
        y1: 1477.2970823234898,
        x2: 312.1489998517619,
        y2: 1447.2970824689319
      },
      {
        x1: 140.83076754527792,
        y1: 1366.5995691807348,
        x2: 226.25592622346903,
        y2: 1350.1110939146288
      },
      {
        x1: 142.28991315442443,
        y1: 1241.9955320980462,
        x2: 223.292402895328,
        y2: 1269.9871994653968
      },
      {
        x1: 282.8170497663659,
        y1: 1141.9652232903131,
        x2: 330.0947699535624,
        y2: 1162.1167643780173
      },
      {
        x1: 295.39524413583734,
        y1: 940.2639788501033,
        x2: 380.8400857133383,
        y2: 942.2581917542439
      },
      {
        x1: 293.02530329466634,
        y1: 790.0279113763222,
        x2: 378.8551887554878,
        y2: 785.4646085167636
      }
    ]
  },
  breakfast: {
    name: 'Beach',
    imageLocation: './images/tracks/beach.png',
    height: 1760,
    width: 1600,
    startPositions: [],
    startAngle: 0,
    laps: 10
  },
  dinner: {
    name: 'Dinner',
    imageLocation: './images/tracks/dinner.png',
    height: 2432,
    width: 2405,
    startPositions: [],
    startAngle: 0,
    laps: 10
  },
  diy: {
    name: 'DIY',
    imageLocation: './images/tracks/diy.png',
    height: 1824,
    width: 1440,
    startPositions: [],
    startAngle: 0,
    laps: 10
  },
  picnic: {
    name: 'Picnic',
    imageLocation: './images/tracks/picnic.png',
    height: 1472,
    width: 2144,
    startPositions: [],
    startAngle: 0,
    laps: 10
  }
};

},{}],8:[function(require,module,exports){
module.exports = (A, B, C) => {
  return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
};

},{}],9:[function(require,module,exports){
const ccw = require('./ccw');

module.exports = (A, B, C, D) => {
  if (ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D)) {
    return true;
  }

  return false;
};

},{"./ccw":8}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"../game/player-car":5}],12:[function(require,module,exports){
const Game = require('./game');

document.addEventListener('DOMContentLoaded', () => {
  new Game().start();
});

},{"./game":4}]},{},[12]);
