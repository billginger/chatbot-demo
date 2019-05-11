const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/*
channel: 1 = WeChat; 2 = Facebook
direction: 1 = in; 2 = out
messageId: only direction of in has
keywords: only direction of in has
level: understanding level, only direction of in has. 0 = no, 1 = little, 2 = some, 3 = yes, 4 = very, 5 = complete
waiting: waiting for manual processing, only direction of in has
manual: manual processing, only direction of out has
*/

const chatbotDialogueSchema = new mongoose.Schema({
	brand: ObjectId,
	channel: Number,
	direction: Number,
	message: ObjectId,
	to: String,
	from: String,
	content: String,
	keywords: Array,
	level: Number,
	waiting: Boolean,
	manual: Boolean
}, {
	timestamps: true
});

module.exports = mongoose.model('ChatbotDialogue', chatbotDialogueSchema);
