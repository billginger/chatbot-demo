const express = require('express');
const { handleAuth } = require('../controllers/auth.js');
const { handleBind, handleBindSuccess } = require('../controllers/bind.js');

const router = express.Router();

router.post('/wechat/auth', handleAuth);
router.put('/wechat/bind/:id', handleBind);
router.put('/wechat/bind/success/:id', handleBindSuccess);

module.exports = router;
