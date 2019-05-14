const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const chatbotRuleSchema = new mongoose.Schema({
	name: String,
	keywords: Array,
	replyContent: {
		en: String,
		chs: String,
		cht: String
	},
	replyOptions: Object,
	allowGuess: Boolean,
	enableWaiting: Boolean,
	createdBy: ObjectId,
	brand: ObjectId,
	isDeleted: { type: Boolean, default: false }
}, {
	timestamps: true
});

module.exports = mongoose.model('ChatbotRule', chatbotRuleSchema, 'chatbotRules');
