var Service = (function (window) {

	var LOCATION = '/coordinates';
	var _coords = {
		x: 0,
		y: 0
	};
	var callbacks = [];
	var _xhr;

	function isEqual (cords) {
		return _coords.x === cords.x && _coords.y === cords.y;
	}

	function dropXhr () {
		_xhr.abort();
		_xhr = void 0;
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
				if (!isEqual(coords)) {
					callbacks.forEach(function (callback) {
						callback(_coords);
					});
				}

				createXhr("GET");
			} else {
				alert(xmlhttp.statusText) // вызвать обработчик ошибки с текстом ответа
			}
		}

		if (type === "GET") {
			_xhr.send(type);
		} else if( type === "POST") {
			_xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			_xhr.send(JSON.stringify(_coords);
		}

	}

	/* Интерфейс */
	return  {
		start: function (options) {
			options = options || {type: 'xhr'};

			if (options.type === 'xhr') {
				if (_xhr) {
					dropXhr();
				}

				createXhr("GET");

			}
		},

		stop: function () {
			dropXhr();
		},

		set: function (cords) {
			if (!isEqual(cords)) {
				_coords = cords;
			}

			createXhr("POST", _coords);
		},

		onStatChange: function (callback) {
			callbacks.push(callback);
		},
	}
})(window);