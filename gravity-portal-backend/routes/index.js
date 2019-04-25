const express = require('express');
const { userLogin, userCheck, userProfile, userLogout } = require('../controllers/user.js');

const router = express.Router();

router.post('/api/user/login', userLogin);
router.get('/api/user/profile', userCheck, userProfile);
router.get('/api/user/logout', userLogout);

module.exports = router;
