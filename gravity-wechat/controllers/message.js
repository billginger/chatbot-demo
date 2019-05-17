const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Message = require('../models/message.js');
const Account = require('../models/account.js');

/* replyMessage - msgmenu has tested, Not supported
return: { errcode: 40200, errmsg: 'invalid account type' }
---
const postData = JSON.stringify({
	touser,
	msgtype: 'msgmenu',
	msgmenu: {
		head_content: '您对本次服务是否满意呢?',
		list: [
			{ id: '101', content: '满意' },
			{ id: '102', content: '不满意' }
		],
		tail_content: '欢迎再次光临'
	}
}); */

const replyMessage = (accessToken, touser, content) => {
	const options = {
		hostname: 'api.weixin.qq.com',
		path: `/cgi-bin/message/custom/send?access_token=${accessToken}`,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	};
	const postData = JSON.stringify({
		touser,
		msgtype: 'text',
		text: { content }
	});
	httpsRequest(options, postData, (err, data) => {
		if (err) return log.error(err);
		if (data.errcode) return log.error(data);
		log.info('Message has been replied!');
	});
};

exports.handleMessage = (req, res, next) => {
	// Save Message
	const json = req.json;
	const originalId = json.ToUserName;
	Message.create(json, (err, message) => {
		if (err) return log.error(err);
		log.info('Message has been saved!');
		// Forward Message
		Account.findOne({ originalId }, (err, account) => {
			if (err) return log.error(err);
			const id = account.brand;
			const options = {
				hostname: 'gravity.nodejs.top',
				path: `/api/chatbot/message/${id}`,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			};
			const postData = JSON.stringify(json);
			httpsRequest(options, postData, (err, data) => {
				if (err) return log.error(err);
				log.info('Message has been forwarded!');
				/* Debug Code Begin */
				if (json.FromUserName != 'o2rwt1SxkOsK6AwJw-0oEVg6WRq8') {
					return log.debug('Stop by debug code.');
				}
				/* Debug Code End */
				if (!data.content) {
					return;
				}
				// Reply Message
				replyMessage(account.accessToken, json.FromUserName, data.content);
			});
		});
	});
};

exports.sendMessage = (req, res, next) => {
	const brand = req.params.id;
	const touser = req.body.touser;
	const content = req.body.content;
	Account.findOne({ brand }, (err, account) => {
		if (err) return next(err);
		const options = {
			hostname: 'api.weixin.qq.com',
			path: `/cgi-bin/message/custom/send?access_token=${account.accessToken}`,
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		};
		const postData = JSON.stringify({
			touser,
			msgtype: 'text',
			text: { content }
		});
		httpsRequest(options, postData, (err, data) => {
			if (err) return next(err);
			res.send({ data });
			log.info('Message has been sent!');
		});
	});
};
