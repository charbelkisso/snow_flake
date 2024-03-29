sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";

	return Object.extend("snow.controller.Flake", {
		
		init: function(x,y) {
			var maxWeight = 5,
			    maxSpeed = 3;
			    
			this.x = x;
			this.y = y;
			
			this.r = this.randomBetween(0, 1);
			this.a = this.randomBetween(0, Math.PI);
			
			this.aStep = 0.01;
			this.weight = this.randomBetween(2, maxWeight);
			this.alpha = (this.weight / maxWeight);
			this.speed = (this.weight / maxWeight) * maxSpeed;
		},
		
		randomBetween: function(min, max, round) {
			var num = Math.random() * (max - min + 1) + min;
			if (round) {
				return Math.floor(num);
			} else {
				return num;
			}
		},
		
		distanceBetween: function(vector1, vector2) {
			var dx = vector2.x - vector1.x,
				dy = vector2.y - vector1.y;
			return Math.sqrt(dx * dx + dy * dy);
		},
		
		update: function() {
			this.x += Math.cos(this.a) * this.r;
			this.a += this.aStep;
			this.y += this.speed;
		}
		
	});
});