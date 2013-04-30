(function(){
	"use strict";

	window.$ = function(expr, con) {
		var selected = [].slice.call((con || document).querySelectorAll(expr));
		return selected.length==1?selected[0]:selected;
	}

	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame   ||
		window.mozRequestAnimationFrame      ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	var particles = [];
	var maxParticles = 200;
	var newParticles = 1;
	var minRadius = 20;
	var maxJitter = 5;
	var ctx;
	var lastPosition = {x:0,y:0};
	var currentPosition = {x:0,y:0};

	function generateParticles(center) {
		var direction = Math.atan2(center.y-lastPosition.y,center.x-lastPosition.x);

		for (var i=0; i<newParticles; i++) {
			var theta = (2*Math.PI/4)*(0.5-Math.random());
			particles.push({
				x:center.x+minRadius*Math.cos(direction+theta),
				y:center.y+minRadius*Math.sin(direction+theta),
				t:100
			});
		}

		for (var i=0; i<particles.length; i++)
			if (Math.sqrt((particles[i].x-center.x)*(particles[i].x-center.x)+(particles[i].y-center.y)*(particles[i].y-center.y))<=minRadius) {
				var moveDir = Math.atan2(particles[i].y-center.y,particles[i].x-center.x);
				var jitter = Math.random()*maxJitter;
				particles[i].x = center.x+(minRadius+jitter)*Math.cos(moveDir);
				particles[i].y = center.y+(minRadius+jitter)*Math.sin(moveDir);
			}
	}

	function drawParticles() {
		requestAnimationFrame(drawParticles);
		flushParticles();
		ctx.clearRect(0,0,500,500);
		//console.log("Number of particles: "+particles.length);
		for (var i in particles) {
			ctx.fillStyle = "rgba(0,0,0,"+(particles[i].t/100)+")";
			ctx.fillRect(particles[i].x-1,particles[i].y-1,2,2);
			particles[i].t-=2;
		}
	}

	function flushParticles() {
		// remove particles that have a ttl <= 0
		for (var i=0; i<particles.length; i++)
			if (particles[i].t<=0)
				particles.splice(i,1);
	}


	window.addEventListener("DOMContentLoaded",function(){
		ctx = $("#canv").getContext("2d");
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 2;
		$("#canv").addEventListener("mousemove",function(e){
			lastPosition = currentPosition;
			currentPosition = {x:e.offsetX,y:e.offsetY};
			generateParticles(currentPosition);
		});
		drawParticles();
	});
})();