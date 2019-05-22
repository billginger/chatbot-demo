const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	sender: { id: String },
	recipient: { id: String },
	timestamp: Number,
	message: {
		mid: String,
		seq: Number,
		text: String,
		nlp: Object
	},
	postback: {
		title: String,
		payload: String
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
