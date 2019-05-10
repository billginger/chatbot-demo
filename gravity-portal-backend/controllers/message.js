const { handleSuccess } = require('../libs/handle.js');
const Message = require('../models/message.js');

const replyMessage = (req, res, next, message) => {
	const content = 'Hi~';
	handleSuccess(req, res, `[chatbot] [message] [reply]`, { content });
};

exports.handleMessage = (req, res, next) => {
	let message = req.body;
	message.brand = req.params.id;
	message.channel = message.MsgId ? 1 : 2;
	Message.create(message, (err, msg) => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [message] [add]`);
		replyMessage(req, res, next, message);
	});
};
