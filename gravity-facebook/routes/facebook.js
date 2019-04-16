const express = require('express');
const { verify, handleMessage } = require('../controllers/webhook.js');

const router = express.Router();

router.get('/webhook', verify);

router.post('/webhook', handleMessage);

module.exports = router;
