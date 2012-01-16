var Canvas = function(elem) {
	this.elem 		= elem;
	this.height		= elem.height;
	this.width		= elem.width;
	this.context	= elem.getContext('2d');	
};

Canvas.prototype.clear = function() {
	this.elem.height 	= this.elem.height;
	this.elem.width		= this.elem.width;
};



var Viewport = function(params) {
	this.height		= params.height;
	this.width		= params.width;
	this.x			= 0;
	this.y			= 0;
	this.margin		= params.margin;
	
	this.middle_x	= this.width / 2;
	this.middle_y	= this.height / 2;
}

Viewport.prototype.draw = function(game) {
	
	//get player car
	
	var player_car = null;
	
	for (var i = 0; i < game.objects.length; i++) {		
		if (game.objects[i] instanceof Player_Car) {
			player_car 	= game.objects[i];
			
			//centre on player car
			
			this.x		= player_car.car.x;
			this.y		= player_car.car.y;
		}
	}		
}

Viewport.prototype.draw_grid = function(game) {
	
	game.canvas.context.save();
	game.canvas.context.beginPath();
	
	//plot horizontal lines
	
	for (var i = 0; i < game.viewport.width; i += game.cell_width) {
		game.canvas.context.moveTo(i, 0);
  		game.canvas.context.lineTo(i, game.viewport.height);  		
	}
	
	//plot vertical lines
	
	for (var i = 0; i < game.viewport.height; i += game.cell_height) {
		game.canvas.context.moveTo(0, i);
		game.canvas.context.lineTo(game.viewport.width, i);
	}
	
	//draw
	
	game.canvas.context.lineWidth = 1;
  	game.canvas.context.strokeStyle = "red";
	game.canvas.context.stroke();
	
	//plot centre
	
	game.canvas.context.beginPath();
	game.canvas.context.strokeStyle = "black";
	game.canvas.context.arc(game.viewport.width / 2, game.viewport.height / 2, 2, 0, Math.PI*2, true); 
	game.canvas.context.closePath();
	
	//draw
	
	game.canvas.context.fill();   
	
	game.canvas.context.restore();	
}

Viewport.prototype.within = function(game, x, y, inc_margin) {
	if (inc_margin == false) {
		if (x > 0 && y > 0 && x < game.canvas.width && y < game.canvas.height) {		
			return true;
		}
		
		return false;
	}
	else {
		if ((x + game.viewport.margin) > 0 && (y + game.viewport.margin) > 0 && x < (game.canvas.width + game.viewport.margin) && y < (game.canvas.height + game.viewport.margin)) {			
			return true;
		}
		
		return false;
	}
}



var Util = {	
	ccw: function(A,B,C) {
		return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
	},
	
	intersects: function(A, B, C, D) {
		if (this.ccw(A, C, D) != this.ccw(B, C, D) && this.ccw(A, B, C) != this.ccw(A, B, D)) {
			return true;
		}
		
		return false
	}
}

