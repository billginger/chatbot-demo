const { handleSuccess } = require('../libs/handle.js');
const Message = require('../models/message.js');

exports.brandWechatMessage = (req, res, next) => {
	let message = req.body;
	message.brand = req.params.id;
	message.channel = 1;
	Message.create(message, (err, msg) => {
		if (err) return next(err);
		req.msg = msg;
		next();
	});
};

exports.handleWeChatMessage = (req, res, next) => {
	let message = req.msg;
	// After handleMessage
	const content = 'Hi~';
	handleSuccess(req, res, `[brand] [wechat] [message] [reply]`, { content });
};
