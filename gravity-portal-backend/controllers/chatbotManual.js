const { log } = require('../libs/log.js');
const { handleSuccess } = require('../libs/handle.js');
const httpsRequest = require('../libs/httpsRequest.js');
const ChatbotDialogue = require('../models/chatbotDialogue.js');
const ChatbotCustomer = require('../models/chatbotCustomer.js');

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

const sendFacebook = (req, res, next, id, recipient, text) => {
	const options = {
		hostname: 'gravity.nodejs.top',
		path: `/facebook/send/${id}`,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	};
	const postData = JSON.stringify({ recipient, text });
	httpsRequest(options, postData, (err, data) => {
		if (err) return next(err);
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
		// Save to ChatbotDialogue
		const data = {
			brand: dialogue.brand,
			channel,
			direction: 2,
			message: dialogue.message,
			to: dialogue.from,
			from: dialogue.to,
			content,
			manual: true
		}
		ChatbotDialogue.create(data, err => {
			if (err) return next(err);
			// Send
			if (channel == 1) {
				sendWechat(req, res, next, brand, replyTo, content);
			} else {
				sendFacebook(req, res, next, brand, replyTo, content);
			}
		});
		// Asyn processing
		const conditions = {
			id: dialogue.from,
			brand: dialogue.brand,
			channel
		};
		ChatbotCustomer.updateOne(conditions, { scene: 'Manual' }, err => {
			if (err) log.error(err);
		});
	});
};

exports.chatbotManualClose = (req, res, next) => {
	const id = req.params.id;
	ChatbotDialogue.findById(id, (err, dialogue) => {
		if (err) return next(err);
		const from = dialogue.from;
		const brand = dialogue.brand;
		const channel = dialogue.channel;
		ChatbotDialogue.updateMany({ from, brand, channel, waiting: true }, { waiting: false }, err => {
			if (err) return next(err);
			ChatbotCustomer.updateOne({ id: from, brand, channel }, { scene: 'Normal' }, err => {
				if (err) return next(err);
				handleSuccess(req, res, `[chatbot] [manual] [close] [brand:${id}]`, 'ok');
			});
		});
	});
};
