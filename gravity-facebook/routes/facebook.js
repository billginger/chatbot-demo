const express = require('express');
const { log } = require('../libs/log.js');

const router = express.Router();

router.get('/', (req, res) => {
	res.send('Hello World!');
});

router.get('/webhook', (req, res) => {
	const VERIFY_TOKEN = 'abc';
	const mode = req.query['hub.mode'];
	const token = req.query['hub.verify_token'];
	const challenge = req.query['hub.challenge'];
	if (mode && token) {
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			log.info('WEBHOOK_VERIFIED');
			res.send(challenge);
		} else {
			res.sendStatus(403);
		}
	}
});

router.post('/webhook', (req, res) => {
	const body = req.body;
	if (body.object === 'page') {
		log.debug(body.entry);
		res.send('EVENT_RECEIVED');
	} else {
		res.sendStatus(404);
	}
});

module.exports = router;
