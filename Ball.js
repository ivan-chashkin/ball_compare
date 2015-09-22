var Ball = function(className){
	var _this = this;
	this.coords = {
		x: 0,
		y: 0
	};

	this._on = {};
	this._started = false;

	this.el = document.createElement('div');
	this.el.className = className;
	this.el.addEventListener('mousedown', function(evt){
		_this._started = true;
		_this._start({
			x: evt.clientX,
			y: evt.clientY
		});
	});
	this.el.addEventListener('touchstart', function(evt){
		this._started = true;
		_this._start({
			x: evt.touches[0].clientX,
			y: evt.touches[0].clientY
		});
	});
	document.addEventListener('mousemove', function(evt){
		if (this._started) {
			evt.preventDefault()
			_this._move({
				x: evt.clientX,
				y: evt.clientY
			});
		}
	});
	this.el.addEventListener('touchmove', function(evt){
		if (this._started) {
			_this._move({
				x: evt.touches[0].clientX,
				y: evt.touches[0].clientY
			});
		}
	});
	document.addEventListener('mouseup', function(evt){
		this._started = false;
		_this._end({
			x: evt.clientX,
			y: evt.clientY
		});
	});
	this.el.addEventListener('touchend', function(evt){
		this._started = false;
		_this._end({
			x: evt.changedTouches[0].clientX,
			y: evt.changedTouches[0].clientY
		});
	});
};
Ball.prototype._start = function(data){
	this._coords = {
		x: data.x - this.coords.x,
		y: data.y - this.coords.y
	};
};
Ball.prototype._move = function(data){
	if (this._coords) {
		this.move({
			x: data.x - this._coords.x,
			y: data.y - this._coords.y
		});
	}
};
Ball.prototype._end = function(data){
	if (this._coords) {
		this._move(data);
		this._coords = null;
	}
};
Ball.prototype.move = function(data){
	if ( this.coords.x != data.x || this.coords.y != data.y ) {
		this.coords.x = data.x;
		this.coords.y = data.y;
		this.el.style.transform = 'translateX('+(this.coords.x).toFixed(4)+'px) translateY('+(this.coords.y).toFixed(4)+'px)'
		this.el.style.webkitTransform = 'translateX('+(this.coords.x).toFixed(4)+'px) translateY('+(this.coords.y).toFixed(4)+'px)'
		this.trigger('move', this.coords);
	}
};
Ball.prototype.on = function(evt, fn){
	if (!this._on[evt]) {
		this._on[evt] = [];
	}
	this._on[evt].push(fn);
};
Ball.prototype.trigger = function(evt, data){
	if (this._on[evt]) {
		for (var i = 0; i < this._on[evt].length; i++) {
			this._on[evt][i](data);
		} 
	}
};