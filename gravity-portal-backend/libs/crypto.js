const crypto = require('crypto');

const getPassword = pw => {
	const salt = 'A Lannister always pays his debts.';
	const key = crypto.pbkdf2Sync(pw, salt, 32, 32, 'sha512');
	return key.toString('hex');
};

const getToken = () => {
	const buf = crypto.randomBytes(32);
	return buf.toString('hex');
};

module.exports = { getPassword, getToken };
