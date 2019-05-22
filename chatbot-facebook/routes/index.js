const express = require('express');
const { verify } = require('../controllers/webhook.js');
const { handleMessages, sendMessage } = require('../controllers/message.js');
const { ipCheck } = require('../controllers/ip.js');
const { handleBind } = require('../controllers/bind.js');

const router = express.Router();

// From Facebook Server
router.get('/facebook/webhook', verify);
router.post('/facebook/webhook', handleMessages);

// From Portal Microservice
router.put('/facebook/bind/:id', ipCheck, handleBind);
router.post('/facebook/send/:id', ipCheck, sendMessage);

module.exports = router;
