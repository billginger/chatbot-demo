const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Message = require('../models/message.js');

exports.brandWechatMessage = (req, res, next) => {
	// Get Message
	log.debug(req.body);
	res.send({});
};
