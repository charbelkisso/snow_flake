sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"snow/controller/Flake"
], function (Component, Button, Bar, MessageToast, Device, Flake) {

	return Component.extend("snow.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			//var rendererPromise = this._getRenderer();

			// define snow variables
			this._numFlakes = 200;
			this._windowW = Device.resize.width; //window.innerWidth;
			this._windowH = Device.resize.height; //window.innerHeight;
			this._flakes = [];

			// get canvas to paint in: there seems to be only one in 
			// in the Fiori Launchpad so this should always work
			var canvas = $("canvas").get(0);
			if (!canvas) {
				// stop processing in case we don't have a canvas!
				return;
			}
			this._ctx = canvas.getContext("2d");

			// first loop to create all Flake objects
			var i = this._numFlakes,
				flake, x, y;
			while (i--) {
				// create new flake
				flake = new Flake();
				// get random location
				x = flake.randomBetween(0, this._windowW, true);
				y = flake.randomBetween(0, this._windowH, true);
				flake.init(x, y);
				// add flake
				this._flakes.push(flake);
			}
			// start looping all flakes to move them
			this.loop();

		},
		loop: function () {
			var i = this._flakes.length,
				flakeA;

			// clear canvas
			this._ctx.save();
			this._ctx.setTransform(1, 0, 0, 1, 0, 0);
			this._ctx.clearRect(0, 0, this._windowW, this._windowH);
			this._ctx.restore();

			// loop through the flakes and "animate" them
			while (i--) {
				flakeA = this._flakes[i];
				flakeA.update();

				this._ctx.beginPath();
				this._ctx.arc(flakeA.x, flakeA.y, flakeA.weight, 0, 2 * Math.PI, false);
				this._ctx.fillStyle = "rgba(255, 255, 255, " + flakeA.alpha + ")";
				this._ctx.fill();

				if (flakeA.y >= this._windowH) {
					flakeA.y = -flakeA.weight;
				}
			}
			// continue animation...
			requestAnimationFrame(this.loop.bind(this));
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});