const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/*
type: Account Type. 0 = Operation Account; 1 = Brand Account
master: Master Account that who create this account
brand: The brand currently operating
isRoot: The first admin account
*/

const userSchema = new mongoose.Schema({
	name: String,
	password: String,
	token: String,
	fullname: String,
	email: String,
	group: Array,
	type: Number,
	master: ObjectId,
	brand: ObjectId,
	isRoot: { type: Boolean, default: false },
	isLocked: { type: Boolean, default: false },
	isDeleted: { type: Boolean, default: false }
}, {
	timestamps: true
});

module.exports = mongoose.model('User', userSchema);
