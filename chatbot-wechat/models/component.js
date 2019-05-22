const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
	verifyTicket: String,
	accessToken: String
}, {
	timestamps: true
});

module.exports = mongoose.model('Component', componentSchema, 'component');
