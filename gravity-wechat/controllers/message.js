const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Message = require('../models/message.js');

exports.handleMessage = (req, res, next) => {
	// Save Message
	const json = req.json;
	Message.create(json, (err, message) => {
		if (err) return log.error(err);
		// Forward Message
		const options = {
			hostname: 'gravity.nodejs.top',
			path: `/api/brand/wechat/message/${id}`,
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		};
		httpsRequest(options, json, (err, data) => {
			if (err) return log.error(err);
			log.info(data);
		});
	});
};
