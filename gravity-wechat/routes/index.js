const express = require('express');

const router = express.Router();

router.get('/wechat', (req, res) => {
	res.send('OK');
});

module.exports = router;
