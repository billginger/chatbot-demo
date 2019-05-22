const express = require('express');
const { getXml } = require('../controllers/xml.js');
const { handleAuth } = require('../controllers/auth.js');
const { handleMessage, sendMessage } = require('../controllers/message.js');
const { ipCheck } = require('../controllers/ip.js');
const { getComponent } = require('../controllers/component.js');
const { accountAuth } = require('../controllers/account.js');
const { getAuthorization, getAuthorizer, updateAccount, updatePortal } = require('../controllers/bind.js');

const router = express.Router();

// From WeChat Server
router.post('/wechat/auth', getXml, handleAuth);
router.post('/wechat/account/:id', getXml, handleMessage);

// From Portal Microservice
router.put('/wechat/auth/:id', ipCheck, getComponent, accountAuth);
router.post('/wechat/send/:id', ipCheck, sendMessage);

// From Client
router.get('/wechat/bind/:id', getComponent, getAuthorization, getAuthorizer, updateAccount, updatePortal);

module.exports = router;
