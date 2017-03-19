const expect = require('expect');
const {generateMessage} = require('./../utils/message');

describe('generateMessage', () => {
	it('should return the message object in the required format', () => {
		let from = 'Gary';
		let text = 'Forget about it';

		let generatedMessage = generateMessage(from, text);
		
		expect(generatedMessage.createdAt).toBeA('number');
		expect(generatedMessage).toInclude({from, text});
	});
});


