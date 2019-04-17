const express = require('express');
const { verify, handle } = require('../controllers/webhook.js');

const router = express.Router();

router.get('/facebook/webhook', verify);
router.post('/facebook/webhook', handle);

module.exports = router;
