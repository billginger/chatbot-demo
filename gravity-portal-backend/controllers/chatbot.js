const { handleSuccess, handleFail } = require('../libs/handle.js');
const ChatbotRule = require('../models/chatbotRule.js');
const User = require('../models/user.js');

exports.chatbotRuleCheckName = (req, res, next) => {
	const brand = req.profile.brand;
	const name = req.body.name && req.body.name.trim();
	const nameAnyCase = new RegExp(`^${name}$`, 'i');
	let conditions = { name: nameAnyCase, brand };
	if (req.params.id) conditions._id = { $ne: req.params.id };
	ChatbotRule.countDocuments(conditions, (err, count) => {
		if (err) return next(err);
		if (count) {
			const statusText = JSON.stringify({ id: 'msgExist', key: 'labelName', value: name });
			return handleFail(req, res, `[chatbot] [rule] [check name] [name:${name}] [exist]`, statusText);
		}
		next();
	});
};

exports.chatbotRuleList = (req, res, next) => {
	const brand = req.profile.brand;
	const fields = 'name keywords createdAt updatedAt';
	ChatbotRule.find({ brand, isDeleted: false }, fields, { sort: '-_id' }, (err, rules) => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [rule] [list]`, rules);
	});
};

exports.chatbotRuleAdd = (req, res, next) => {
	const createdBy = req.profile._id;
	const brand = req.profile.brand;
	const name = req.body.name && req.body.name.trim();
	const keywords = req.body.keywords && req.body.keywords.split('\n');
	let replyContent = '';
	let replyOptions = '';
	try {
		replyContent = req.body.replyContent.length && JSON.parse(req.body.replyContent);
		replyOptions = req.body.replyOptions.length && JSON.parse(req.body.replyOptions);
	} catch (err) {
		return next(err);
	}
	const allowGuess = req.body.allowGuess;
	const enableWaiting = req.body.enableWaiting;
	let data = { name, keywords, replyContent, replyOptions, allowGuess, enableWaiting, createdBy, brand };
	ChatbotRule.create(data, (err, rule) => {
		if (err) return next(err);
		const _id = rule._id.toString();
		handleSuccess(req, res, `[chatbot] [rule] [add] [id:${_id}] [name:${name}]`, { _id });
	});
};

exports.chatbotRuleDetail = (req, res, next) => {
	const _id = req.params.id;
	ChatbotRule.findOne({ _id, isDeleted: false }, async (err, rule) => {
		if (err) return next(err);
		if (!rule) return handleFail(req, res, `[chatbot] [rule] [detail] [id:${_id}] [not found]`, 'msgNotFound');
		const createdByAsync = User.findById(rule.createdBy, 'name');
		const updatedByAsync = User.findById(rule.updatedBy, 'name');
		const createdBy = await createdByAsync;
		const updatedBy = await updatedByAsync;
		if (createdBy && createdBy.name) {
			rule._doc.createdBy = createdBy.name;
		}
		if (updatedBy && updatedBy.name) {
			rule._doc.updatedBy = updatedBy.name;
		}
		handleSuccess(req, res, `[chatbot] [rule] [detail] [id:${_id}] [name:${rule.name}]`, rule);
	});
};

exports.chatbotRuleEdit = (req, res, next) => {
	const _id = req.params.id;
	const updatedBy = req.profile._id;
	const name = req.body.name && req.body.name.trim();
	const keywords = req.body.keywords && req.body.keywords.split('\n');
	let replyContent = '';
	let replyOptions = '';
	try {
		console.log(replyOptions);
		replyContent = req.body.replyContent.length && JSON.parse(req.body.replyContent);
		replyOptions = req.body.replyOptions.length && JSON.parse(req.body.replyOptions);
		console.log(replyOptions);
	} catch (err) {
		return next(err);
	}
	const allowGuess = req.body.allowGuess;
	const enableWaiting = req.body.enableWaiting;
	let data = { name, keywords, replyContent, replyOptions, allowGuess, enableWaiting, updatedBy };
	ChatbotRule.updateOne({ _id, isDeleted: false }, data, err => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [rule] [edit] [id:${_id}] [name:${name}]`, 'ok');
	});
};

exports.chatbotRuleDelete = (req, res, next) => {
	const id = req.params.id;
	const updatedBy = req.profile._id;
	ChatbotRule.findByIdAndUpdate(id, { updatedBy, isDeleted: true }, (err, rule) => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [rule] [delete] [id:${id}] [name:${rule.name}]`, 'ok');
	});
};
