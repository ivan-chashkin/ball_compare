var Service = (function (window) {

	var LOCATION = '/coordinates';
	var _coords = {
		x: 0,
		y: 0
	};
	var callbacks = [];
	var _xhr;
	var _socket;

	function isEqual (cords) {
		return _coords.x === cords.x && _coords.y === cords.y;
	}

	function dropXhr () {
		if (_xhr) {
			_xhr.abort();
			_xhr = void 0;
		}
	}

	function createXhr (type, data) {
		_xhr = new XMLHttpRequest();
		_xhr.open(type, LOCATION, true);

		_xhr.onreadystatechange = function () {
			if (_xhr.readyState != 4) {
				return;
			}

			if (_xhr.status === 200) {
				//ОБработать данные

				var coords = JSON.parse(_xhr.responseText);

				_coords = coords;
				callbacks.forEach(function (callback) {
					callback(_coords);
				});

				createXhr("GET");
			} else {
				console.log(_xhr.statusText) // вызвать обработчик ошибки с текстом ответа
			}
		}

		if (type === "GET") {
			_xhr.send(type);
		} else if( type === "POST") {
			_xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			_xhr.send(JSON.stringify(_coords));
		}

	}

	function createSocket() {
		_socket = io.connect('http://'+window.location.host+'/', { forceNew:true });
		_socket.on('connect', function(){
			console.log('connect');
		});
		_socket.on('coordinates', function(coords){
			_coords = coords;
			callbacks.forEach(function (callback) {
				callback(coords);
			});
		});
		_socket.on('disconnect', function(){
			console.log('connect');
		});
	}

	function dropSocket() {
		if (_socket) {
			_socket.disconnect();
			_socket = null;
		}
	}

	/* Интерфейс */
	return  {
		start: function (options) {
			options = options || {type: 'xhr'};
			
			this.stop();

			if (options.type === 'xhr') {
				createXhr("GET");
			}

			if (options.type === 'socket') {
				createSocket();
			}
		},

		stop: function () {
			dropXhr();
			dropSocket();
		},

		set: function (cords) {
			if (!isEqual(cords)) {
				_coords = cords;
				if (_xhr) {
					createXhr("POST", _coords);
				} else if (_socket) {
					_socket.emit('coordinates', _coords);
				} else {
					callbacks.forEach(function (callback) {
						callback(cords);
					});
				}
			}
		},

		onStatChange: function (callback) {
			callbacks.push(callback);
		},
	}
})(window);