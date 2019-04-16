const config = require('../config.js');
const httpsRequest = require('../libs/httpsRequest.js');
const { log } = require('../libs/log.js');

const access_token = config.access_token;
const verify_token = config.verify_token;

const options = {
	hostname: 'graph.facebook.com',
	path: '/v2.6/me/messages?access_token=' + access_token,
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

const sendMessage = (id, message) => {
	const postData = JSON.stringify({ recipient: { id }, message });
	httpsRequest(options, postData, (err, data) => {
		if (err) {
			return log.error(err);
		}
		log.info(data);
	});
};

const handleMessage = (id, message) => {
	let response;
	if (message.text) {
		if (message.nlp) {
			//nlp
		}
		response = {
			text: `You sent the message: "${message.text}". Now send me an image!`
		};
	} else if (message.attachments) {
		const url = message.attachments[0].payload.url;
		response = {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'generic',
					elements: [{
						title: 'Is this the right picture?',
						subtitle: 'Tap a button to answer.',
						image_url: url,
						buttons: [{
							type: 'postback',
							title: 'Yes!',
							payload: 'yes'
						}, {
							type: 'postback',
							title: 'No!',
							payload: 'no'
						}]
					}]
				}
			}
		};
	}
	sendMessage(id, response);
};

const handlePostback = (id, postback) => {
	let response;
	let payload = postback.payload;
	if (payload == 'yes') {
		response = { text: 'Thanks!' };
	} else if (payload == 'no') {
		response = { text: 'Oops, try sending another image.' }
	}
	sendMessage(id, response);
};

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

exports.handle = (req, res) => {
	const body = req.body;
	log.debug(JSON.stringify(body));
	if (body.object != 'page') {
		return res.sendStatus(404);
	}
	body.entry.forEach(entry => {
		const event = entry.messaging[0];
		const id = event.sender.id;
		if (event.message) {
			handleMessage(id, event.message);        
		} else if (event.postback) {
			handlePostback(id, event.postback);
		}
	});
	res.send('EVENT_RECEIVED');
};
