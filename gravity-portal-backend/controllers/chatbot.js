const { handleSuccess, handleFail } = require('../libs/handle.js');
const ChatbotRule = require('../models/chatbotRule.js');
const User = require('../models/user.js');

exports.chatbotRuleList = (req, res, next) => {
	const brand = req.profile.brand;
	ChatbotRule.find({ brand, isDeleted: false }, null, { sort: '-_id' }, (err, rules) => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [rule] [list]`, rules);
	});
};

exports.chatbotRuleAdd = (req, res, next) => {
	const createdBy = req.profile._id;
	const brand = req.profile.brand;
	const name = req.body.name && req.body.name.trim();
	const nameAnyCase = new RegExp(`^${name}$`, 'i');
	ChatbotRule.countDocuments({ name: nameAnyCase, brand }, (err, count) => {
		if (err) return next(err);
		if (count) {
			const statusText = JSON.stringify({ id: 'msgExist', key: 'labelName', value: name });
			return handleFail(req, res, `[chatbot] [rule] [add] [name:${name}] [exist]`, statusText);
		}
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
		let data = { name, keywords, replyContent, createdBy, brand };
		if (replyOptions) {
			data.replyOptions = replyOptions;
		}
		if (allowGuess) {
			data.allowGuess = allowGuess;
		}
		if (enableWaiting) {
			data.enableWaiting = enableWaiting;
		}
		ChatbotRule.create(data, (err, rule) => {
			if (err) return next(err);
			const id = rule._id.toString();
			handleSuccess(req, res, `[chatbot] [rule] [add] [id:${id}] [name:${name}]`, rule);
		});
	});
};

exports.chatbotRuleDetail = (req, res, next) => {
	const _id = req.params.id;
	ChatbotRule.findOne({ _id, isDeleted: false }, async (err, rule) => {
		if (err) return next(err);
		if (!rule) return handleFail(req, res, `[chatbot] [rule] [detail] [id:${_id}] [not found]`, 'msgNotFound');
		const createdBy = User.findById(rule.createdBy, 'name');
		const updatedBy = User.findById(rule.updatedBy, 'name');
		const createdUser = await createdBy;
		const updatedUser = await updatedBy;
		if (createdBy.name) {
			rule = { ...rule._doc, createdBy: createdUser.name };
		}
		if (updatedBy.name) {
			rule = { ...rule._doc, createdBy: updatedUser.name };
		}
		handleSuccess(req, res, `[chatbot] [rule] [detail] [id:${_id}] [name:${rule.name}]`, rule);
	});
};

exports.chatbotRuleEdit = (req, res, next) => {
	const _id = req.params.id;
	const updatedBy = req.profile._id;
	const brand = req.profile.brand;
	const name = req.body.name && req.body.name.trim();
	const nameAnyCase = new RegExp(`^${name}$`, 'i');
	ChatbotRule.countDocuments({ name: nameAnyCase, brand, _id: { $ne: _id } }, (err, count) => {
		if (err) return next(err);
		if (count) {
			const statusText = JSON.stringify({ id: 'msgExist', key: 'labelName', value: name });
			return handleFail(req, res, `[chatbot] [rule] [add] [name:${name}] [exist]`, statusText);
		}
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
		let data = { name, keywords, replyContent, updatedBy, brand };
		if (replyOptions) {
			data.replyOptions = replyOptions;
		}
		if (allowGuess) {
			data.allowGuess = allowGuess;
		}
		if (enableWaiting) {
			data.enableWaiting = enableWaiting;
		}
		ChatbotRule.updateOne({ _id, isDeleted: false }, data, err => {
			if (err) return next(err);
			handleSuccess(req, res, `[chatbot] [rule] [edit] [id:${_id}] [name:${name}]`, 'ok');
		});
	});
};
