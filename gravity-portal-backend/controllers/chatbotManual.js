const { handleSuccess, handleFail } = require('../libs/handle.js');
const ChatbotRule = require('../models/chatbotRule.js');
const ChatbotDialogue = require('../models/chatbotDialogue.js');

exports.chatbotManualList = (req, res, next) => {
	const brand = req.profile.brand;
	const fields = 'content from channel createdAt';
	ChatbotDialogue.find({ brand, direction: 1, waiting: true }, fields, { sort: '-_id' }, (err, dialogues) => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [manual] [list]`, dialogues);
	});
};

exports.chatbotManualIntervene = (req, res, next) => {
	const id = req.params.id;
	ChatbotDialogue.findById(id, (err, dialogue) => {
		if (err) return next(err);
		const brand = dialogue.brand;
		const from = dialogue.from;
		const to = dialogue.from;
		const fields = 'content direction from to createdAt';
		ChatbotDialogue.find({ brand, $or: [{ from }, { to }] }, fields, { sort: '_id' }, (err, dialogues) => {
			if (err) return next(err);
			handleSuccess(req, res, `[chatbot] [manual] [intervene]`, dialogues);
		});
	});
};
