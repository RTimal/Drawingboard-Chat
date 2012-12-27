var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	hbs = require('express-hbs'),
	users = {};

//io.set('log level', 0);
app.engine('hbs', hbs.express3({partialsDir: __dirname + '/views/partials'}));
app.set('view engine', 'hbs');
app.set('view', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

var port;
switch(process.env.NODE_ENV) {
	case "production":
		port = 80;
		break;
	default: 
		port = 81;
		break;
	}

server.listen(port);

io.sockets.on('connection', function (socket) {
	
	socket.on('join', function (user) {
		u = JSON.parse(user);
		socket.join(u.room);
		users[u.uid] = u;
	});

	socket.on('chatmessage', function (message) {
		this.broadcast.to(users[message.uid].room).emit('chatmessage', message);
	});

	socket.on('leave', function (data) {
		users[data.userID] = null;
	});
});

app.get('/rooms', function (req, res) {
	res.render('index.hbs');
});
