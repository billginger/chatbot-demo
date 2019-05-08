const express = require('express');
const { handleAuth } = require('../controllers/auth.js');
const { handleBind } = require('../controllers/bind.js');

const router = express.Router();

router.post('/wechat/auth', handleAuth);
router.put('/wechat/bind/:id', handleBind);

module.exports = router;
