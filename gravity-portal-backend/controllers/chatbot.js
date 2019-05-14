const { handleSuccess, handleFail } = require('../libs/handle.js');
const ChatbotRule = require('../models/chatbotRule.js');

exports.brandList = (req, res, next) => {
	ChatbotRule.find({ isDeleted: false }, null, { sort: '-_id' }, (err, rules) => {
		if (err) return next(err);
		if (!rules) return handleFail(req, res, `[chatbot] [rule] [list] [not found]`, 'msgNotFound');
		handleSuccess(req, res, `[chatbot] [rule] [list]`, rules);
	});
};
