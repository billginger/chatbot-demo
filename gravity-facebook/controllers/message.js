const config = require('../config.js');
const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Message = require('../models/message.js');

const access_token = config.access_token;

if (!access_token) {
	throw 'Please check config.js!';
}

const options = {
	hostname: 'graph.facebook.com',
	path: '/v2.6/me/messages?access_token=' + access_token,
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

const handleMessage = msg => {
	// Save Message
	Message.create(msg, (err, message) => {
		if (err) return log.error(err);
		log.info('Message has been saved!');
		// Forward Message
	});
}

exports.handleMessages = (req, res, next) => {
	const body = req.body;
	log.info(JSON.stringify(body));
	if (body.object != 'page') {
		return res.sendStatus(404);
	}
	res.send('EVENT_RECEIVED');
	// Split Message
	body.entry.forEach(entry => {
		handleMessage(entry.messaging[0]);
	});
};
