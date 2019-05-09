const { handleSuccess, handleFail } = require('../libs/handle.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Message = require('../models/message.js');

exports.brandWechatMessage = (req, res, next) => {
	let message = req.body;
	message.brand = req.params.id;
	message.channel = 1;
	Message.create(message, (err, msg) => {
		if (err) return next(err);
		handleSuccess(req, res, `[brand] [wechat] [message] [add]`, { success: 1 });
		req.msg = msg;
		next();
	});
};

exports.handleWeChatMessage = (req, res, next) => {
	let message = req.msg;
};
