const { handleSuccess, handleFail } = require('../libs/handle.js');
const ChatbotRule = require('../models/chatbotRule.js');

exports.chatbotRuleList = (req, res, next) => {
	const brand = req.profile.brand;
	ChatbotRule.find({ brand, isDeleted: false }, null, { sort: '-_id' }, (err, rules) => {
		if (err) return next(err);
		if (!rules) return handleFail(req, res, `[chatbot] [rule] [list] [not found]`, 'msgNotFound');
		handleSuccess(req, res, `[chatbot] [rule] [list]`, rules);
	});
};
