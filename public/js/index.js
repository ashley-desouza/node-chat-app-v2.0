// We initiate a connection by using the io() method. This connection is a persistent connection.
// This method is available when we import the socket.io library
var socket = io();

// socket.on('connect', function (message) {
// 	socket.emit('createMessage', {
// 		from: 'ABCD',
// 		text: 'Hello there!'
// 	});
// });

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
	console.log('newMessage: ', message);
});