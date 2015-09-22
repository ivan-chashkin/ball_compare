var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// Socket.IO init
var server = require('http').Server(app);
var io = require('socket.io')( server );

var coordinates = {
	x: 0,
	y: 0
};

var _changed = true;

app.use('/static', express.static(path.resolve('static')));
app.use(bodyParser.json()); // for parsing application/json


app.get('/', function (req, res) {
  res.sendFile(path.resolve('index.html'));
});

var _waitUpdate = [];
var waitUpdate = function(fn) {
	_waitUpdate.push(fn);
};
var update = function(){
	var fn;
	while( fn = _waitUpdate.shift() ) {
		fn();
	}
};

app.get('/coordinates', function (req, res) {
	waitUpdate(function() {
		res.json(coordinates);
	});
});

app.post('/coordinates', function (req, res) {
	if (req.body && (req.body.x !== coordinates.x || req.body.y !== coordinates.y)) {
		coordinates = req.body;
		update();
		res.json(coordinates);
		// _changed = true;
	}
})

io.on('connection', function(socket){
	socket.on('disconnect', function(){
			
	});

	var update = function() {
		socket.emit('coordinates', coordinates);
	};
	
	socket.on('coordinates', function(data){
		if (data.x !== coordinates.x || data.y !== coordinates.y) {
			coordinates = data;
			update();
		}
	});
});

var srv = server.listen(3000, function () {
	var host = srv.address().address;
	var port = srv.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});