const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/*
channel: 1 = WeChat; 2 = Facebook
direction: 1 = in; 2 = out
message: only direction of in has
level: understanding level, only direction of in has. 0 = no, 1 = half, 2 = yes, 3 = manual, 4 = trained, 5 = ignore
waiting: waiting for manual processing, only direction of out has
options: select options, only direction of out has
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
	level: Number,
	waiting: Boolean,
	options: Object,
	manual: Boolean
}, {
	timestamps: true
});

module.exports = mongoose.model('ChatbotDialogue', chatbotDialogueSchema, 'chatbotDialogues');
