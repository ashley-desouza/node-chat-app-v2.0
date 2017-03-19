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

socket.on('newLocationMessage', function (message) {
	console.log('newLocationMessage: ', message);

	var li = jQuery('<li></li>');
	var a = jQuery('<a>Where Am I?</a>');

	li.text(`${message.from}: `);
	a.attr('target', '_blank');
	a.attr('href', message.url);
	li.append(a);
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

jQuery('#send-location').on('click', function () {
	// Refer - https://developer.mozilla.org/en-US/docs/Web/API/Geolocation

	// Check if the user's browser has the geolocation property implemented by the Navigator object
	if (!navigator.geolocation) {
		return alert('Geolocation is not enabled on your browser');
	}

	// Refer - https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
	navigator.geolocation.getCurrentPosition(function (position) {
		let latitude = position.coords.latitude;
		let longitude = position.coords.longitude;

		socket.emit('createNewLocationMessage', {
			from: 'User', 
			latitude,
			longitude
		});
	}, function (err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	});

});