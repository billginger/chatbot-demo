const express = require('express');
const { userLogin, userCheck, userProfile, userLogout, userBrand } = require('../controllers/user.js');
const { systemHome, systemDashboard } = require('../controllers/system.js');
const { brandList, brandAdd, brandDetail } = require('../controllers/brand.js');
const { brandWechatAuth, brandWechatBind, brandFacebookBind } = require('../controllers/brandBind.js');
const { ipCheck } = require('../controllers/ip.js');
const { handleMessage } = require('../controllers/message.js');
const { chatbotRuleList, chatbotRuleAdd } = require('../controllers/chatbot.js');

const router = express.Router();

// From Portal Frontend
router.post('/api/user/login', userLogin);
router.get('/api/user/profile', userCheck, userProfile);
router.get('/api/user/logout', userLogout);
router.put('/api/user/brand/:id', userCheck, userBrand);
router.get('/api/system/home', userCheck, systemHome);
router.get('/api/system/dashboard', userCheck, systemDashboard);
router.get('/api/brand', userCheck, brandList);
router.post('/api/brand/add', userCheck, brandAdd);
router.get('/api/brand/:id', userCheck, brandDetail);
router.get('/api/brand/wechat/bind/:id', userCheck, brandWechatAuth);
router.get('/api/brand/facebook/bind/:id', userCheck, brandFacebookBind);
router.get('/api/chatbot/rule', userCheck, chatbotRuleList);
router.post('/api/chatbot/rule/add', userCheck, chatbotRuleAdd);

// From WeChat Microservice
router.post('/api/brand/wechat/bind/:id', ipCheck, brandWechatBind);

// From WeChat & Facebook Microservice
router.post('/api/chatbot/message/:id', ipCheck, handleMessage);

module.exports = router;
