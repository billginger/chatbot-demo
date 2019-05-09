const express = require('express');
const { getMessage, handleMessage } = require('../controllers/message.js');
const { auth } = require('../controllers/auth.js');
const { ipCheck } = require('../controllers/ip.js');
const { getComponent } = require('../controllers/component.js');
const { accountAuth } = require('../controllers/account.js');
const { getAuthorization, getAuthorizer, updateAccount, updatePortal } = require('../controllers/bind.js');

const router = express.Router();

// From WeChat Server
router.post('/wechat/auth', getMessage, auth);
router.post('/wechat/account/:id', getMessage, handleMessage);

// From Portal Microservice
router.put('/wechat/bind/:id', ipCheck, getComponent, accountAuth);

// From Client
router.get('/wechat/bind/:id', getComponent, getAuthorization, getAuthorizer, updateAccount, updatePortal);

module.exports = router;
