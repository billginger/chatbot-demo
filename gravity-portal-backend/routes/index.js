const express = require('express');
const { userLogin, userCheck, userProfile, userLogout } = require('../controllers/user.js');
const { systemHome } = require('../controllers/system.js');
const { brandAdd, brandDetail } = require('../controllers/brand.js');

const router = express.Router();

router.post('/api/user/login', userLogin);
router.get('/api/user/profile', userCheck, userProfile);
router.get('/api/user/logout', userLogout);
router.get('/api/system/home', userCheck, systemHome);
router.post('/api/brand/add', userCheck, brandAdd);
router.get('/api/brand/:id', userCheck, brandDetail);

module.exports = router;
