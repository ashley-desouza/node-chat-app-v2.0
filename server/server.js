const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Path to the public client assets
// Refer https://nodejs.org/dist/latest-v6.x/docs/api/path.html#path_path_join_paths
const publicPath = path.join(__dirname, '../public');

// Setup an Express App
let app = express();
const port = process.env.PORT || 3000;

/* 	Enable the web server to accept socket connections
	Create a server - 
	Refer https://www.npmjs.com/package/socket.io#in-conjunction-with-express
*/
var server = http.createServer(app);
var io = socketIO(server);

// Set up event listeners
// Refer https://www.npmjs.com/package/socket.io#how-to-use
io.on('connection', socket => {
	console.log('User connected');

	socket.emit('newMessage', {
		from: 'Admin',
		text: 'Welcome new user',
		createdAt: new Date().getTime()
	});
	
	// Broadcast the new message to all users except the originator.
	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New user joined',
		createdAt: new Date().getTime()		
	})


	socket.on('createMessage', message => {
		// Broadcast the new message to all users including the originator.
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
	});

	io.on('disconnect', () => {
		console.log('User Disconnected');
	});
});


// Use express middleware to define the location for static resources - 
// Refer http://expressjs.com/en/guide/using-middleware.html
app.use(express.static(publicPath));

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

module.exports = {app};
