const express = require('express');
const { wechatAuth } = require('../controllers/auth.js');
const { getComponent } = require('../controllers/component.js');
const { getAuthorization, getAuthorizer, wechatBind } = require('../controllers/bind.js');
const { portalBind } = require('../controllers/portalBind.js');

const router = express.Router();

// From WeChat
router.post('/wechat/auth', wechatAuth);
router.get('/wechat/bind/:id', getComponent, getAuthorization, getAuthorizer, wechatBind);

// From Portal
router.put('/wechat/bind/:id', getComponent, portalBind);

module.exports = router;
