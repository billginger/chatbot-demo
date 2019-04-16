const express = require('express');
const { verify, handle } = require('../controllers/webhook.js');

const router = express.Router();

router.get('/webhook', verify);

router.post('/webhook', handle);

module.exports = router;
