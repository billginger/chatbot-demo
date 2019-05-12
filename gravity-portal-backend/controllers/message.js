const { handleSuccess } = require('../libs/handle.js');
const Message = require('../models/message.js');
const ChatbotCustomer = require('../models/chatbotCustomer.js');
const ChatbotDialogue = require('../models/ChatbotDialogue.js');

const matchNone = {
	en: 'Sorry, I do not understand what you mean. Do you need help from manual customer service?',
	chs: '对不起，我不明白你的意思。请问是否需要人工客服的帮助？',
	cht: '對不起，我不明白你的意思。請問是否需要人工客服的幫助？'
};

const replyMessage = (req, res, next, dialogue, customer) => {
	let language = customer.language;
	if (!language) {
		if (/[\u4e00-\u9fa5]+/.test(dialogue.content)) {
			language = 'chs';
		} else {
			language = 'en';
		}
	}
	let content = matchNone[language];
	/* if (matchSomething) {
		content = dbContent;
	} */
	if (customer.scene == 'manual') {
		content = '';
	}
	ChatbotDialogue.create(dialogue, (err, doc) => {
		if (err) return next(err);
		if (content.length) {
			const data = {
				brand: dialogue.brand,
				channel: dialogue.channel,
				direction: 2,
				message: dialogue.message,
				to: dialogue.from,
				from: dialogue.to,
				content,
				manual: false
			}
			ChatbotDialogue.create(data);
		}
		handleSuccess(req, res, `[chatbot] [message] [reply]`, { content });
	});
};

const analyzeCustomer = (req, res, next, dialogue) => {
	let data = {
		id: dialogue.from,
		brand: dialogue.brand,
		channel: dialogue.channel
	};
	ChatbotCustomer.findOne(data, (err, customer) => {
		if (err) return next(err);
		if (customer) return replyMessage(req, res, next, dialogue, customer);
		ChatbotCustomer.create(data, (err, customer) => {
			if (err) return next(err);
			replyMessage(req, res, next, dialogue, customer);
		});
	});
};

const analyzeMessage = (req, res, next, msg) => {
	let dialogue = {
		brand: msg.brand,
		channel: msg.channel,
		direction: 1,
		message: msg._id
	};
	if (msg.channel == 1) {
		dialogue.to = msg.ToUserName;
		dialogue.from = msg.FromUserName;
		dialogue.content = msg.Content;
	} else {
		dialogue.to = msg.recipient.id;
		dialogue.from = msg.sender.id;
		dialogue.content = msg.message.text;
	}
	analyzeCustomer(req, res, next, dialogue);
};

exports.handleMessage = (req, res, next) => {
	let message = req.body;
	message.brand = req.params.id;
	message.channel = message.MsgId ? 1 : 2;
	Message.create(message, (err, msg) => {
		if (err) return next(err);
		handleSuccess(req, res, `[chatbot] [message] [add]`);
		analyzeMessage(req, res, next, msg);
	});
};
