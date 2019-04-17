const config = require('../config.js');
const httpsRequest = require('../libs/httpsRequest.js');
const { log } = require('../libs/log.js');

exports.decryptMsg = (req, res, next) => {
	let data = '';
	req.setEncoding('utf8');
	req.on('data', d => {
		data += d;
	});
	req.on('end', () => {
		log.debug(data);
	});
};
