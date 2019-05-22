const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	ToUserName: String,
	FromUserName: String,
	CreateTime: Number,
	MsgType: String,
	Content: String,
	MsgId: Number
}, {
	timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
