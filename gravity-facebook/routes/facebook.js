const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('Hello World!');
});

router.get('/webhook', (req, res) => {
	log.info('WEBHOOK_VERIFIED');
	res.send('ok!');
});

module.exports = router;
