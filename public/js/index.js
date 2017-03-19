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
	var messageTextbox = jQuery('#message');
	err.preventDefault();

	socket.emit('createMessage', {
		from: 'Anon',
		text: messageTextbox.val()
	}, function (data) {
		messageTextbox.val('');
		console.log('Acknowledged!');
	});
});

var sendLocationButton = jQuery('#send-location')
sendLocationButton.on('click', function () {
	// Refer - https://developer.mozilla.org/en-US/docs/Web/API/Geolocation

	// Check if the user's browser has the geolocation property implemented by the Navigator object
	if (!navigator.geolocation) {
		return alert('Geolocation is not enabled on your browser');
	}

	// Disable the 'Send My Location' button while processing is ongoing
	sendLocationButton.attr('disabled', 'disabled').text('Sending location...');

	// Refer - https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
	navigator.geolocation.getCurrentPosition(function (position) {
		// Enable the 'Send My Location' button after we successfully receive the user position
		sendLocationButton.removeAttr('disabled').text('Send My Location');

		let latitude = position.coords.latitude;
		let longitude = position.coords.longitude;

		socket.emit('createNewLocationMessage', {
			from: 'User', 
			latitude,
			longitude
		});
	}, function (err) {
		// Enable the 'Send My Location' button after there is a failure in retrieving the user's location
		sendLocationButton.removeAttr('disabled').text('Send My Location');
		console.warn(`ERROR(${err.code}): ${err.message}`);
	});

});