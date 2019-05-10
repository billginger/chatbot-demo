const express = require('express');
const { verify } = require('../controllers/webhook.js');
const { handleMessages } = require('../controllers/message.js');
const { ipCheck } = require('../controllers/ip.js');
const { handleBind } = require('../controllers/bind.js');

const router = express.Router();

// From Facebook Server
router.get('/facebook/webhook', verify);
router.post('/facebook/webhook', handleMessages);

// From Portal Microservice
router.put('/facebook/bind/:id', ipCheck, handleBind);

module.exports = router;
