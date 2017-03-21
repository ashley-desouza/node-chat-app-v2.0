// We initiate a connection by using the io() method. This connection is a persistent connection.
// This method is available when we import the socket.io library
var socket = io();

// Function to scroll to the bottom of the message-list
function scrollToBottom() {
	// Selectors
	var messageList = jQuery('#message-list');
	var currMessage = messageList.children('li:last-child');

	// Heights
	var scrollHeight = messageList.prop('scrollHeight');
	var clientHeight = messageList.prop('clientHeight');
	var scrollTop = messageList.prop('scrollTop');
	var currMessageHeight = currMessage.innerHeight();
	var prevMessageHeight = currMessage.prev().innerHeight();

	if (clientHeight + scrollTop + currMessageHeight + prevMessageHeight >= scrollHeight) {
		messageList.scrollTop(scrollHeight);
	}
}

socket.on('connect', function (message) {
	// IMP: Refer - https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
	var urlParams = new URLSearchParams(window.location.search);
	var params = {};

	// IMP: Refer - https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/entries
	for (var pair of urlParams) {
		params[pair[0]] = pair[1];
	}

	socket.emit('joinRoom', params, function (err) {
		// The acknowledgement callback takes 1 parameter - The error message
		// If there was an error on the backend in processing the request, then re-direct the user back to the home page.
		if (err) {
			alert(err);
			window.location.href = '/';
		}
	});

	console.log('Connected to server');
});

// Listener for updating the People Listener
socket.on('updateUserList', function (usersList) {
	var users = jQuery('#users');

	// Add an ordered List to hold the list of connected users
	var ol = jQuery('<ol></ol>');
	
	usersList.forEach(user => {
		// Add each user from the returned list as a list item
		ol.append(`<li>${user.username}</li>`);
	});

	// Use the html() method because we would like to completely wipe out the old People List
	users.html(ol);
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
	var formattedTime = moment().format('h:mm a');
	
	var templete = jQuery('#message-template').html();
	var html = Mustache.render(templete, {
		from: message.from,
		text: message.text,
		createdAt: formattedTime
	});
	jQuery('#message-list').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment().format('h:mm a');

	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});
	jQuery('#message-list').append(html);
	scrollToBottom();
	
	// var li = jQuery('<li></li>');
	// var a = jQuery('<a>Where Am I?</a>');

	// li.text(`${message.from} ${formattedTime}: `);
	// a.attr('target', '_blank');
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#message-list').append(li);
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