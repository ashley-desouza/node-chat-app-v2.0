const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {User} = require('./utils/user');

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
var newUser = new User();

// Set up event listeners
// Refer https://www.npmjs.com/package/socket.io#how-to-use
io.on('connection', socket => {
	console.log('User connected');

	// Socket Rooms: Refer - https://socket.io/docs/rooms-and-namespaces/#rooms
	socket.on('joinRoom', (params, callback) => {
		// Before allowing a user to join a certain room, we must do some validation to make sure the user and room are valid
		if (!isRealString(params.username) || !isRealString(params.room)) {
			return callback('User name and chat room must be strings');
		}

		socket.join(params.room);

		// Remove any exiting user having the same socket id
		newUser.removeUser(socket.id);

		// Add a new user to the list of users.
		newUser.addNewUser(socket.id, params.username, params.room);

		// Notify the connected client
		socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat app`));
		
		// Emit the updated list of users connected to the same room
		io.to(params.room).emit('updateUserList', newUser.getUserList(params.room));

		// Broadcast the new message to all clients in the same room except the originator.
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.username} has joined`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		// Broadcast the new message to all users including the originator.
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createNewLocationMessage', message => {
		// Broadcast the new message to all users including the originator.
		io.emit('newLocationMessage', generateLocationMessage(message.from, message.latitude, message.longitude));
	});

	socket.on('disconnect', () => {
		let user = newUser.removeUser(socket.id);

		// Check and make sure that a valid user actually removed.
		if (user) {
			io.to(user.room).emit('updateUserList', newUser.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.username} has left.`));
		}
	});
});


// Use express middleware to define the location for static resources - 
// Refer http://expressjs.com/en/guide/using-middleware.html
app.use(express.static(publicPath));

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

module.exports = {app};
