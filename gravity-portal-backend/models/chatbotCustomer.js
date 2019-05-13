const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/*
channel: 1 = WeChat; 2 = Facebook
language: en, chs, cht
scene: Normal, Waiting, Manual
*/

const chatbotCustomerSchema = new mongoose.Schema({
	id: String,
	brand: ObjectId,
	channel: Number,
	language: String,
	scene: String
}, {
	timestamps: true
});

module.exports = mongoose.model('ChatbotCustomer', chatbotCustomerSchema, 'chatbotCustomers');
