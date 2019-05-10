const express = require('express');
const { verify } = require('../controllers/webhook.js');
const { handleMessages } = require('../controllers/message.js');

const router = express.Router();

router.get('/facebook/webhook', verify);
router.post('/facebook/webhook', handleMessages);

module.exports = router;
