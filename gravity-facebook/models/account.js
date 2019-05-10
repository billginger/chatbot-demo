const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
	appid: String,
	brand: String,
	isDeleted: { type: Boolean, default: false }
}, {
	timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
