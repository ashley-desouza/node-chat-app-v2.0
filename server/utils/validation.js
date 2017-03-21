const isRealString = str => {
	// Validate that the input is non-zero string.
	return typeof str === 'string' && str.trim().length > 0;
};

module.exports = {isRealString};