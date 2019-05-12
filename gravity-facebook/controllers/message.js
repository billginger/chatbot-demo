const config = require('../config.js');
const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Message = require('../models/message.js');
const Account = require('../models/account.js');

const access_token = config.access_token;

if (!access_token) {
	throw 'Please check config.js!';
}

const replyMessage = (id, text) => {
	const options = {
		hostname: 'graph.facebook.com',
		path: '/v2.6/me/messages?access_token=' + access_token,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	};
	const postData = JSON.stringify({
		recipient: { id },
		message: { text }
	});
	httpsRequest(options, postData, (err, data) => {
		if (err) return log.error(err);
		log.info('Message has been replied!');
	});
};

const handleMessage = msg => {
	// Save Message
	const appid = msg.recipient.id;
	Message.create(msg, (err, message) => {
		if (err) return log.error(err);
		log.info('Message has been saved!');
		// Forward Message
		Account.findOne({ appid }, (err, account) => {
			if (err) return log.error(err);
			const id = account.brand;
			const options = {
				hostname: 'gravity.nodejs.top',
				path: `/api/chatbot/message/${id}`,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			};
			const postData = JSON.stringify(msg);
			httpsRequest(options, postData, (err, data) => {
				if (err) return log.error(err);
				log.info('Message has been forwarded!');
				/* Debug Code Begin */
				if (msg.sender.id != '2371811989546001') {
					return log.debug('Stop by debug code.');
				}
				/* Debug Code End */
				if (!data.content) {
					return;
				}
				// Reply Message
				replyMessage(msg.sender.id, data.content);
			});
		});
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
