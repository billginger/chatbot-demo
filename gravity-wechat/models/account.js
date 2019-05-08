const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const accountSchema = new mongoose.Schema({
	appid: String,
	accessToken: String,
	refreshToken: String,
	funcInfo: Array,
	name: String,
	avatar: String,
	serviceType: { id: Number },
	verifyType: { id: Number },
	originalId: String,
	alias: String,
	qrcodeUrl: String,
	businessInfo: { open_pay: Number, open_shake: Number, open_scan: Number, open_card: Number, open_store: Number },
	idc: Number,
	principalName: String,
	signature: String,
	brand: ObjectId,
	isDeleted: { type: Boolean, default: false }
}, {
	timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
