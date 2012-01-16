var Track = function(params) {
	this.name					= params.name;
	this.loc					= params.loc;
	this.height					= params.height;
	this.width					= params.width;
	this.start_positions		= params.start_positions;
	this.start_angle			= params.start_angle;
	this.laps					= params.laps;
	this.tangents				= params.tangents;
	
	//image
	
	this.img		= new Image();
	this.img.src	= this.loc;	
};

Track.prototype.draw_tangents = function(game) {
	game.canvas.context.save();
	game.canvas.context.beginPath();
	
	//plot horizontal lines
	
	for (var i = 0; i < this.tangents.length; i++) {		
		game.canvas.context.moveTo(game.viewport.x + this.tangents[i].x1, game.viewport.y + this.tangents[i].y1);
		game.canvas.context.lineTo(game.viewport.x + this.tangents[i].x2, game.viewport.y + this.tangents[i].y2);			
				
		
		game.canvas.context.lineWidth 		= 3;
	  	game.canvas.context.strokeStyle 	= 'pink';
		game.canvas.context.stroke();		
	}
				
	game.canvas.context.restore();
}

Track.prototype.draw = function(game) {	
	game.canvas.context.save();
	game.canvas.context.drawImage(this.img, game.viewport.x, game.viewport.y);
	game.canvas.context.restore();	
	
	if (game.draw_ai_path == true) {
		this.draw_ai_path(game);
	}
}