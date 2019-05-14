const { handleSuccess, handleFail } = require('../libs/handle.js');
const ChatbotRule = require('../models/chatbotRule.js');

exports.chatbotRuleList = (req, res, next) => {
	const brand = req.profile.brand;
	ChatbotRule.find({ brand, isDeleted: false }, null, { sort: '-_id' }, (err, rules) => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [rule] [list]`, rules);
	});
};

exports.chatbotRuleAdd = (req, res, next) => {
	const name = req.body.name && req.body.name.trim();
	const nameAnyCase = new RegExp(`^${name}$`, 'i');
	ChatbotRule.countDocuments({ name: nameAnyCase }, (err, count) => {
		if (err) return next(err);
		if (count) {
			const statusText = JSON.stringify({ id: 'msgExist', key: 'labelName', value: name });
			return handleFail(req, res, `[chatbot] [rule] [add] [name:${name}] [exist]`, statusText);
		}
		const createdBy = req.profile._id;
		const brand = req.profile.brand;
		const keywords = req.body.keywords && req.body.keywords.split('\n');
		let replyContent = '';
		let replyOptions = '';
		try {
			replyContent = req.body.replyContent && JSON.parse(req.body.replyContent);
			replyOptions = req.body.replyOptions && JSON.parse(req.body.replyOptions);
		} catch (err) {
			return next(err);
		}
		const allowGuess = req.body.allowGuess;
		const enableWaiting = req.body.enableWaiting;
		let conditions = { name, keywords, replyContent, createdBy, brand };
		if (replyOptions) {
			conditions.replyOptions = replyOptions;
		}
		if (allowGuess) {
			conditions.allowGuess = allowGuess;
		}
		if (enableWaiting) {
			conditions.enableWaiting = enableWaiting;
		}
		ChatbotRule.create(conditions, (err, rule) => {
			if (err) return next(err);
			const id = rule._id.toString();
			handleSuccess(req, res, `[chatbot] [rule] [add] [id:${id}] [name:${name}]`, rule);
		});
	});
};
