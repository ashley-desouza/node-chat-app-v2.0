// We initiate a connection by using the io() method. This connection is a persistent connection.
// This method is available when we import the socket.io library
var socket = io();

socket.on('connect', function (message) {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
	console.log('newMessage: ', message);

	var li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`);
	jQuery('#message-list').append(li);
});

jQuery('#chat-form').on('submit', function (err) {
	err.preventDefault();

	socket.emit('createMessage', {
		from: 'Anon',
		text: jQuery('#message').val()
	}, function (data) {
		jQuery('#message').val('');
		console.log('Acknowledged!');
	});
});