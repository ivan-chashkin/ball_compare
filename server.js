var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var coordinates = {
	x: 0,
	y: 0
}

app.use('/static', express.static(path.resolve('static')));
app.use(bodyParser.json()); // for parsing application/json


app.get('/', function (req, res) {
  res.sendFile(path.resolve('index.html'));
});


app.get('/coordinates', function (req, res) {
	setTimeout(function () {
		res.json(coordinates);
	}, 500);
});

app.post('/coordinates', function (req, res) {
	coordinates = req.body;
	res.json(coordinates);
})


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});