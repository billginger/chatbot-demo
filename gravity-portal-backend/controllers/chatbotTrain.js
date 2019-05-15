const { handleSuccess, handleFail } = require('../libs/handle.js');
const ChatbotRule = require('../models/chatbotRule.js');
const ChatbotDialogue = require('../models/chatbotDialogue.js');

exports.chatbotTrainList = (req, res, next) => {
	const brand = req.profile.brand;
	const fields = 'from content channel createdAt updatedAt';
	ChatbotDialogue.find({ brand, direction: 1, level: 0 }, fields, { sort: '-_id' }, (err, dialogues) => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [train] [list]`, dialogues);
	});
};
