const express = require('express');
const { handleAuth } = require('../controllers/auth.js');

const router = express.Router();

router.post('/wechat/auth', handleAuth);

module.exports = router;
