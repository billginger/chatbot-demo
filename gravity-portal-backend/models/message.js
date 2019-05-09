const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/*
channel: Message Channel. 1 = WeChat; 2 = Facebook
*/

const messageSchema = new mongoose.Schema({
	brand: ObjectId,
	channel: Number,
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
