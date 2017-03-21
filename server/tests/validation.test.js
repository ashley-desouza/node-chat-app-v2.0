const expect = require('expect');

const {isRealString} = require('./../utils/validation');

describe('isRealString', () => {
	it('should return true for non-zero string values', () => {
		let result = isRealString('This should be good');

		expect(result).toBe(true);
	});
	it('should return false for non-string values', () => {
		let result = isRealString(22);

		expect(result).toBe(false);
	});
	it('should return false for empty string values', () => {
		let result = isRealString('    ');

		expect(result).toBe(false);
	});
});