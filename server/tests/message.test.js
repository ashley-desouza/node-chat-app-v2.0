const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./../utils/message');

describe('generateMessage', () => {
	it('should return the message object in the required format', () => {
		let from = 'Gary';
		let text = 'Forget about it';

		let generatedMessage = generateMessage(from, text);
		
		expect(generatedMessage.createdAt).toBeA('number');
		expect(generatedMessage).toInclude({from, text});
	});
});

describe('generateLocationMessage', () => {
	it('should return the location message object in the required format', () => {
		let from = 'Glenn';
		let latitude = 20;
		let longitude = 14;
		let url = 'https://google.com/maps?q=20,14'

		let generatedLocationMessage = generateLocationMessage(from, latitude, longitude);
		
		expect(generatedLocationMessage.createdAt).toBeA('number');
		expect(generatedLocationMessage).toInclude({from, url});
	});
});


