const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Message = require('../models/message.js');
const Account = require('../models/account.js');

exports.handleMessage = (req, res, next) => {
	// Save Message
	const json = req.json;
	const originalId = json.ToUserName;
	Message.create(json, (err, message) => {
		if (err) return log.error(err);
		// Forward Message
		Account.findOne({ originalId }, (err, account) => {
			if (err) return log.error(err);
			const id = account.brand;
			const options = {
				hostname: 'gravity.nodejs.top',
				path: `/api/brand/wechat/message/${id}`,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			};
			const postData = JSON.stringify(json);
			httpsRequest(options, postData, (err, data) => {
				if (err) return log.error(err);
				log.debug(data);
				log.info(data);
			});
		});
	});
};
