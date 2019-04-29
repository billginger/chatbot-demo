const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const brandSchema = new mongoose.Schema({
	name: String,
	wechat: String,
	facebook: String,
	createdBy: ObjectId,
	isDeleted: { type: Boolean, default: false }
}, {
	timestamps: true
});

module.exports = mongoose.model('Brand', brandSchema);
