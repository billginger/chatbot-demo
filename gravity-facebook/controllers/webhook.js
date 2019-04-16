const config = require('../config.js');
const { log } = require('../libs/log.js');

const verify_token = config.verify_token;

exports.verify = (req, res) => {
	const mode = req.query['hub.mode'];
	const token = req.query['hub.verify_token'];
	const challenge = req.query['hub.challenge'];
	if (mode != 'subscribe' || token != verify_token) {
		return res.sendStatus(403);
	}
	log.info('WEBHOOK_VERIFIED');
	res.send(challenge);
};

exports.handleMessage = (req, res) => {
	const body = req.body;
	if (body.object != 'page') {
		return res.sendStatus(404);
	}
	log.debug(body.entry);
	res.send('EVENT_RECEIVED');
};