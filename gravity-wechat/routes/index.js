const express = require('express');
const { auth } = require('../controllers/auth.js');
const { getComponent } = require('../controllers/component.js');
const { accountAuth } = require('../controllers/account.js');
const { getAuthorization, getAuthorizer, updateAccount, updatePortal } = require('../controllers/bind.js');

const router = express.Router();

// From WeChat Server
router.post('/wechat/auth', auth);

// From Portal Microservice
router.put('/wechat/bind/:id', getComponent, accountAuth);

// From Client
router.get('/wechat/bind/:id', getComponent, getAuthorization, getAuthorizer, updateAccount, updatePortal);

module.exports = router;
