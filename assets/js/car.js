var Car = function(params, start_x, start_y, start_angle) {	
	this.name 			= params.name;
	
	this.height			= params.height;
	this.width			= params.width;
	
	this.acceleration	= params.acceleration;
	this.braking		= params.braking;
	this.handling		= params.handling;
	this.max_power	 	= params.max_power;
	this.handbrake		= params.handbrake;	
	
	this.img			= new Image();
	this.img.src		= params.loc;
	
	this.x				= start_x;
	this.y				= start_y;
	this.prev_x			= 0;
	this.prev_y			= 0;
	this.angle 			= start_angle;
	this.vx				= 0;
	this.vy				= 0;		
	this.power			= 0;
	this.steering		= 0;
	
	this.laps			= 0;
	this.position		= 0;	
};

Car.prototype.respond_to_events = function(game, keys_down) {
	//steer left?
	
	if (keys_down.left == true) {
		this.angle -= this.steering;
	}
	
	//steer right?
	
	if (keys_down.right == true) {
		this.angle += this.steering;
	}
	
	//accelerate?
	
	if (keys_down.accelerate == true && keys_down.brake == false) {
		if (this.power < this.max_power) {
			this.power += this.acceleration;	
		}
	}
	
	//decelerate?
	
	if ((keys_down.accelerate == true && keys_down.brake == true) || (keys_down.accelerate == false && keys_down.brake == false)) {
		this.power *= game.friction;		
	}
	
	//brake/reverse?
	
	if (keys_down.brake == true && keys_down.accelerate == false) {
		if (this.power > (this.max_power * -1)) {
			this.power -= this.braking;
		}
	}
	
	//handbrake
	
	if (keys_down.handbrake == true && keys_down.left == false && keys_down.right == false) {		
		if (this.power > 0) {
			this.power -= this.handbrake;
		}
		
		//handbrake is not reverse
		
		if (this.power < 0) {
			this.power = 0;
		}
	}
	
	//decrease angle if i'm sliding left
	
	if (keys_down.handbrake == true && keys_down.left == true) {
		this.angle -= this.steering * 0.5;
	}
	
	//increase angle if i'm sliding right
	
	if (keys_down.handbrake == true && keys_down.right == true) {
		this.angle += this.steering * 0.5;		
	}
}

Car.prototype.calculate = function(game, type) {
	
	//record prev x/y
	
	this.prev_x = this.x
	this.prev_y	= this.y;	
	
	//get dx/dy

	var dx = Math.cos(this.angle * (Math.PI / 180));
	var dy = Math.sin(this.angle * (Math.PI / 180));
	
	//add power to velocity to get new point
	
	this.vx += dx * this.power;
	this.vy += dy * this.power;
	
	//apply friction with grip
	
	var grip = Math.abs(Math.atan2(this.y - this.vy, this.x - this.vx)) * 0.01;
	this.vx *= game.friction - grip;
	this.vy *= game.friction - grip
	
	//turn quicker when going faster
	
	this.steering = (this.handling * (Math.abs(this.power) / this.max_power));
	
	//add velocity
	
	if (type == 'player') {
		this.x -= this.vx;
		this.y -= this.vy;
	}
	else if (type == 'ai') {
		this.x += this.vx;
		this.y += this.vy;
	}
}

Car.prototype.draw = function(game, x ,y) {	
	
	//save state
	
	game.canvas.context.save();
	
	//translate to centre & perform rotation
	
	game.canvas.context.translate(x, y);
	game.canvas.context.rotate(this.angle * (Math.PI / 180));
	
	//draw on middle of canvas
	
	game.canvas.context.drawImage(this.img, 0 - (this.width / 2), 0 - (this.height / 2));
	
	//restore state
	
	game.canvas.context.restore();
}






var Player_Car = function(car) {
	this.car = car;
}

Player_Car.prototype.draw = function(game) {
	
	//call controller event method
	
	this.car.respond_to_events(game, game.keys_down);
	
	//call controller calculate method
	
	this.car.calculate(game, 'player');
	
	//call controller draw method
	
	this.car.draw(game, game.viewport.middle_x, game.viewport.middle_y);
}






var Ai_Car = function(car, tangents) {
	this.car 		= car;
	this.i 			= 0;
	this.tangents	= tangents;
	this.path		= [];
	this.keys_down	= {
		accelerate: false,
		brake: false,
		left: false,
		right: false,
		handbrake: false
	}	
}

Ai_Car.prototype.drive = function(game) {
	
	//where is next tangent
	
	var next_tangent = this.tangents[this.i];
	
	//get midpoint of tangent
	
	var midpoint = {x: ((this.tangents[this.i].x1 + this.tangents[this.i].x2) / 2), y: ((this.tangents[this.i].y1 + this.tangents[this.i].y2) / 2)};
	
	//get distance
	
	var xd = (this.car.x + game.viewport.x) - (midpoint.x + game.viewport.x);
	var yd = (this.car.y + game.viewport.y) - (midpoint.y + game.viewport.y);
	var distance = Math.sqrt((xd * xd) + (yd * yd));
	
	//draw line between current point and midpoint
	
	//if (game.debug == true) {
		game.canvas.context.save();
		game.canvas.context.beginPath();
		game.canvas.context.moveTo(this.car.x + game.viewport.x, this.car.y + game.viewport.y);
  		game.canvas.context.lineTo(midpoint.x + game.viewport.x, midpoint.y + game.viewport.y);	
		game.canvas.context.lineWidth = 1;
  		game.canvas.context.strokeStyle = "green";
		game.canvas.context.stroke();
		game.canvas.context.restore();
	//}
	
	//find angle from current point to new point & diff
	
	var new_angle 	= Math.atan2(midpoint.y - this.car.y, midpoint.x - this.car.x) * (180 / Math.PI);
	var angle_diff 	= Math.atan2(Math.sin((new_angle - this.car.angle) * Math.PI / 180), Math.cos((new_angle - this.car.angle) * (180 / Math.PI)));
	
	//reset keypresses
	
	this.keys_down.accelerate	= false;
	this.keys_down.left 		= false;
	this.keys_down.right 		= false;
	this.keys_down.brake		= false;
	this.keys_down.handbrake	= false;
	
	//steering
	
	/*if (Math.abs((this.car.angle - new_angle) - (this.car.laps * 360)) > this.car.handling) {
		if (angle_diff > 0) {
			this.keys_down.right = true;
		}
		else {
			this.keys_down.left = true;
		}
	}*/
	
	this.car.angle = new_angle * (180 / Math.PI);
	
	//acceleration
	
	this.keys_down.accelerate = true;
}

Ai_Car.prototype.draw = function(game) {

	//call ai method
	
	this.drive(game);

	//call controller event method
	
	this.car.respond_to_events(game, this.keys_down);
	
	//call controller event method
	
	this.car.calculate(game, 'ai');
	
	//call controller draw method if in viewport
		
	if (game.viewport.within(game, this.car.x + game.viewport.x, this.car.y + game.viewport.y, true)) {		
		this.car.draw(game, this.car.x + game.viewport.x, this.car.y + game.viewport.y);
	}
	
	//has car crossed line
	
	var A = {
		x: this.car.prev_x - this.car.width + game.viewport.x,
		y: this.car.prev_y - this.car.width + game.viewport.y
	};
	
	var B = {
		x: this.car.x - this.car.width + game.viewport.x,
		y: this.car.y - this.car.width + game.viewport.y
	}
	
	var C = {
		x: this.tangents[this.i].x1 + game.viewport.x,
		y: this.tangents[this.i].y1 + game.viewport.y
	}
	
	var D = {
		x: this.tangents[this.i].x2 + game.viewport.x,
		y: this.tangents[this.i].y2 + game.viewport.y
	}
	
	if (Util.intersects(A, B, C, D)) {
		if (this.i < (this.tangents.length - 1)) {
			this.i++;
		}
		else {
			this.i = 0;
		}
	}
}