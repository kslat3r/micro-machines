var game = {
	
	draw_grid: false,
	canvas_click: true,
	clicked_strs: [],	
	draw_tangents: true,
	
	tick_interval: 100,
	cell_width: 10,
	cell_height: 10,
	
	timer: null,
	canvas: null,
	viewport: null,
	objects: [],
	
	keys: {
		left: 65,
		right: 68,
		accelerate: 87,
		brake: 83,
		handbrake: 32
	},	
	keys_down: {
		left: false,
		right: false,
		accelerate: false,
		brake: false,
		handbrake: false
	},
	
	friction: 0.82,
	
	
	init: function() {
		
		//create canvas object
		
		this.canvas = new Canvas(document.getElementById('canvas'));
				
		//add objects
		
		var track = new Track(tracks[0]);
		
		this.objects.push(track);
		this.objects.push(new Player_Car(new Car(cars[0], track.start_positions[0].x, track.start_positions[0].y, track.start_angle)));
		this.objects.push(new Ai_Car(new Car(cars[1], track.start_positions[1].x, track.start_positions[1].y, track.start_angle), track.tangents));
		
		//create viewport object
		
		var params = {
			height: this.canvas.height,
			width: this.canvas.width,			
			margin: 50
		};
		this.viewport	= new Viewport(params);
		
		//bind events
		
		this.bind_events();
		
		//run internal ticker
		
		this.timer = setInterval(function() {
			game.tick();
		}, this.tick_interval);
	},
	
	
	bind_events: function() {
		
		//keydown events
		
		$(document).keydown(function(e) {			
			if (e.keyCode == game.keys.accelerate || e.keyCode == game.keys.brake || e.keyCode == game.keys.left || e.keyCode == game.keys.right || e.keyCode == game.keys.handbrake) {
				e.preventDefault();
			}
			
			//left
			
			if (e.keyCode == game.keys.left) {				
				game.keys_down.left	= true;				
			}
			
			//right
			
			if (e.keyCode == game.keys.right) {
				game.keys_down.right = true;				
			}
			
			//up
			
			if (e.keyCode == game.keys.accelerate) {
				game.keys_down.accelerate = true;				
			}
			
			//down
			
			if (e.keyCode == game.keys.brake) {
				game.keys_down.brake	= true;				
			}
			
			//slide
			
			if (e.keyCode == game.keys.handbrake) {
				game.keys_down.handbrake = true;				
			}
		});
		
		//keyup events
		
		$(document).keyup(function(e) {
			if (e.keyCode == game.keys.left || e.keyCode == game.keys.right || e.keyCode == game.keys.accelerate || e.keyCode == game.keys.brake || e.keyCode == game.keys.handbrake) {
				e.preventDefault();
			}
			
			//left
			
			if (e.keyCode == game.keys.left) {
				game.keys_down.left = false;
			}
			
			//right
			
			if (e.keyCode == game.keys.right) {
				game.keys_down.right = false;
			}
			
			//up
			
			if (e.keyCode == game.keys.accelerate) {
				game.keys_down.accelerate = false;
			}
			
			//down
			
			if (e.keyCode == game.keys.brake) {
				game.keys_down.brake = false;
			}
			
			//slide
			
			if (e.keyCode == game.keys.handbrake) {
				game.keys_down.handbrake = false;
			}	
		});
		
		//canvas click (for debugging)
		
		if (this.canvas_click == true) {
			$('canvas').click(function(e) {
				//for player car
				
				var x = (game.viewport.x - e.offsetX) + (game.viewport.width / 2);
				var y = (game.viewport.y - e.offsetY) + (game.viewport.height / 2);
				
				//for ai car
				
				//var x = ((game.viewport.x * -1) + e.offsetX);
				//var y = ((game.viewport.y * -1) + e.offsetY);
				console.log(x);
				console.log(y);
					
				//console.log('x: ' + x + ', y: ' + y);
				
				//normal
				
				//game.clicked_strs.push('{x: ' + x + ', y: ' + y + '},' + "\n");
				 
				//tangents
				
				if (game.clicked_strs.length % 2 == 0) {
					game.clicked_strs.push('{x1: ' + x + ', y1: ' + y + ', ');
				} 
				else {
					game.clicked_strs.push('x2: ' + x + ', y2: ' + y + '},' + "\n");
				}
				
				var str = '';
								
				for (var i = 0; i < game.clicked_strs.length; i++) {
					str += game.clicked_strs[i];
				}
				
				if (game.clicked_strs.length % 2 == 0) {
					console.log(str);
					console.log('--');
				}
			});
		}
	},
	
	
	tick: function() {
		this.render();
	},
	
	
	render: function() {
		
		//clear canvas
		
		this.canvas.clear();
		
		//draw objects
		
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].draw(this);
		}
		
		//draw viewport
		
		this.viewport.draw(this);
		
		//draw grid
		
		if (this.draw_grid == true) {
			this.viewport.draw_grid(this);
		}
		
		//draw tangents?
		
		if (this.draw_tangents == true) {
			this.objects[0].draw_tangents(this);
		}
	}
};

