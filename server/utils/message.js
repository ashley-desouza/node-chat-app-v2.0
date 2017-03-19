const moment = require('moment');

let generateMessage = (from, text) => {
	return {
		from, 
		text,
		// createdAt: new Date().getTime()
		createdAt: moment().valueOf()
	};
};

let generateLocationMessage = (from, latitude, longitude) => {
	return {
		from, 
		url: `https://google.com/maps?q=${latitude},${longitude}`,
		// createdAt: new Date().getTime()
		createdAt: moment().valueOf()
	};
};

module.exports = {generateMessage, generateLocationMessage};