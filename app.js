var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require("socket.io")(server);
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('static'));

var lobby = io.of('/');

lobby.on('connection', function(socket) {
	socket.emit('message', 'hello');

	socket.on('draw', function(data) {
		socket.broadcast.emit('draw', data);
	});
});

app.get('/', function(req, res) {
	res.render('index', { });
});

server.listen(3000, function() {
	console.log(`Running on port 3000...`);
});