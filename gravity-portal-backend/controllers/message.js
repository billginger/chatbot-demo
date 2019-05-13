const { handleSuccess } = require('../libs/handle.js');
const Message = require('../models/message.js');
const ChatbotCustomer = require('../models/chatbotCustomer.js');
const ChatbotDialogue = require('../models/chatbotDialogue.js');
const ChatbotRule = require('../models/chatbotRule.js');

const matchNone = {
	en: 'Sorry, I do not understand what you mean.',
	chs: '对不起，我不明白你的意思。',
	cht: '對不起，我不明白你的意思。'
};

const matchNoneNormal = {
	en: 'Do you need help from manual customer service?',
	chs: '请问是否需要人工客服的帮助？',
	cht: '請問是否需要人工客服的幫助？'
};

const matchNoneWaiting = {
	en: 'We have arranged a manual customer service for you, our customer service staff will contact you within 24 hours, please be patient.',
	chs: '已经为你安排人工客服，我们的客服人员将在 24 小时内与你联系，请耐心等候。',
	cht: '已經為你安排人工客服，我們的客服人員將在 24 小時內與你聯繫，請耐心等候。'
};

const manualService = {
	en: 'manual customer service',
	chs: '人工客服',
	cht: '人工客服'
};

const noThanks = {
	en: 'no',
	chs: '不用了',
	cht: '不用了'
};

const understand = content => {
	const yes = ['yes', 'ok', 'sure', 'please', '是', '好', '好的', '好吧', '需要'];
	const no = ['no', 'nope', 'no need', '否', '不用', '不用了', '不需要'];
	content = content.toLowerCase().trim();
	if (yes.indexOf(content) >= 0) {
		return 'yes';
	}
	if (no.indexOf(content) >= 0) {
		return 'no';
	}
	return '';
}

const replyMessage = (req, res, next, dialogue, replyContent, replyOptions, scene) => {
	// Save Dialogues
	ChatbotDialogue.create(dialogue, (err, doc) => {
		if (err) return next(err);
		if (replyContent.length) {
			let data = {
				brand: dialogue.brand,
				channel: dialogue.channel,
				direction: 2,
				message: dialogue.message,
				to: dialogue.from,
				from: dialogue.to,
				content: replyContent,
				manual: false
			}
			if (replyOptions) {
				data.options = replyOptions;
			}
			ChatbotDialogue.create(data);
		}
		// Update Scene
		if (scene) {
			// Update Scene
		}
		handleSuccess(req, res, `[chatbot] [message] [reply]`, { content: replyContent });
	});
}

const matchMessage = (req, res, next, dialogue, customer, content) => {
	let language = customer.language;
	if (!language) {
		if (/[\u4e00-\u9fa5]+/.test(content)) {
			language = 'chs';
		} else {
			language = 'en';
		}
	}
	let replyContent = '';
	let replyOptions = '';
	let scene = '';
	if (customer.scene != 'Manual') {
		const conditions = {
			brand: dialogue.brand,
			keywords: { $elemMatch: { $eq: content } },
			isDeleted: false
		};
		ChatbotRule.findOne(conditions, (err, doc) => {
			if (err) return next(err);
			if (doc && doc.replyContent) {
				// if match
				replyContent = doc.replyContent[language];
			} else {
				// if match none
				replyContent = matchNone[language];
				if (customer.scene == 'Normal') {
					replyContent += matchNoneNormal[language];
					replyOptions = {
						yes: manualService[language],
						no: noThanks[language]
					};
				} else {
					replyContent += matchNoneWaiting[language];
				}
			}
			replyMessage(req, res, next, dialogue, replyContent, replyOptions, scene);
		});
	}
}

const analyzeOptions = (req, res, next, dialogue, customer, options) => {
	console.debug('options:');
	console.debug(options);
	let content = dialogue.content;
	if (options) {
		if (/^\d+$/.test(content)) {
			content = options[content] || content;
		} else if (understand(dialogue.content) == 'no') {
			content = options.no || content;
		} else if (understand(dialogue.content) == 'yes') {
			content = options.yes || content;
		}
	}
	matchMessage(req, res, next, dialogue, customer, content);
};

const analyzeCustomer = (req, res, next, dialogue, options) => {
	let data = {
		id: dialogue.from,
		brand: dialogue.brand,
		channel: dialogue.channel
	};
	ChatbotCustomer.findOne(data, (err, customer) => {
		if (err) return next(err);
		if (customer) return analyzeOptions(req, res, next, dialogue, customer, options);
		data.scene = 'Normal';
		ChatbotCustomer.create(data, (err, customer) => {
			if (err) return next(err);
			analyzeOptions(req, res, next, dialogue, customer, options);
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
	// no content, no options
	if (!dialogue.content) {
		return analyzeCustomer(req, res, next, dialogue);
	}
	// if has content, try to get options
	const oneDayAgo = new Date() - 86400000;
	const conditions = {
		brand: dialogue.brand,
		channel: dialogue.channel,
		direction: 2,
		to: dialogue.from,
		from: dialogue.to,
		options: { $exists: true },
		createdAt: { $gt: new Date(oneDayAgo) }
	};
	ChatbotDialogue.findOne(conditions, null, { sort: '-_id' }, (err, doc) => {
		console.log('ChatbotDialogue:');
		console.log(doc);
		if (err) return next(err);
		if (doc && doc.options) {
			return analyzeCustomer(req, res, next, dialogue, doc.options);
		}
		analyzeCustomer(req, res, next, dialogue);
	});
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
