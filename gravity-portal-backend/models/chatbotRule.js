const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const chatbotRuleSchema = new mongoose.Schema({
	brand: ObjectId,
	name: String,
	keywords: Array,
	replyContent: {
		en: String,
		chs: String,
		cht: String
	},
	replyOptions: Object,
	setScene: String,
	allowGuess: { type: Boolean, default: false },
	isDeleted: { type: Boolean, default: false }
}, {
	timestamps: true
});

module.exports = mongoose.model('ChatbotRule', chatbotRuleSchema, 'chatbotRules');
