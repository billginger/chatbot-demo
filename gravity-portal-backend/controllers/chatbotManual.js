const { handleSuccess, handleFail } = require('../libs/handle.js');
const httpsRequest = require('../libs/httpsRequest.js');
const ChatbotDialogue = require('../models/chatbotDialogue.js');

const sendWechat = (req, res, next, id, touser, content) => {
	const options = {
		hostname: 'gravity.nodejs.top',
		path: `/wechat/send/${id}`,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	};
	const postData = JSON.stringify({ touser, content });
	httpsRequest(options, postData, (err, data) => {
		if (err) return next(err);
		if (data.errcode) return next(data);
		handleSuccess(req, res, `[chatbot] [manual] [send] [brand:${id}]`, 'ok');
	});
}

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

exports.chatbotManualSend = (req, res, next) => {
	const id = req.params.id;
	const content = req.body.content && req.body.content.trim();
	ChatbotDialogue.findById(id, (err, dialogue) => {
		if (err) return next(err);
		const channel = dialogue.channel;
		const brand = dialogue.brand.toString();;
		const replyTo = dialogue.from;
		// 待补充保存到 ChatbotDialogue，改写 chatbotCustomers 的 scene
		if (channel == 1) {
			sendWechat(req, res, next, brand, replyTo, content);
		}
	});
};
