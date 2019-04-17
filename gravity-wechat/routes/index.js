const express = require('express');
const { decryptMsg } = require('../controllers/auth.js');

const router = express.Router();

router.post('/wechat/auth', decryptMsg);

module.exports = router;
