const express = require('express');
const { userLogin, userCheck, userProfile, userLogout } = require('../controllers/user.js');
const { systemHome } = require('../controllers/system.js');
const { brandAdd } = require('../controllers/brand.js');

const router = express.Router();

router.post('/api/user/login', userLogin);
router.get('/api/user/profile', userCheck, userProfile);
router.get('/api/user/logout', userLogout);
router.get('/api/system/home', userCheck, systemHome);
router.post('/api/brand/add', userCheck, brandAdd);

module.exports = router;
