const express = require('express');
const { userLogin, userCheck, userProfile, userLogout, userBrand } = require('../controllers/user.js');
const { systemHome, systemDashboard } = require('../controllers/system.js');
const { brandList, brandAdd, brandDetail, brandWechatBind, brandWechatUpdate } = require('../controllers/brand.js');
const { ipCheck } = require('../controllers/ip.js');
const { brandWechatMessage } = require('../controllers/message.js');

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
router.get('/api/brand/wechat/bind/:id', userCheck, brandWechatBind);

// From WeChat Microservice
router.post('/api/brand/wechat/bind/:id', ipCheck, brandWechatUpdate);
router.post('/api/brand/wechat/message/:id', ipCheck, brandWechatMessage);

module.exports = router;
