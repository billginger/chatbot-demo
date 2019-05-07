const https = require('https');

module.exports = (options, postData, callback) => {
	options.headers['Content-Length'] = (postData ? Buffer.byteLength(postData) : 0);
	const req = https.request(options, res => {
		let data = '';
		res.on('data', d => {
			data += d;
		});
		res.on('end', () => {
			try {
				data = JSON.parse(data);
			} finally {
				callback(0, data);
			}
		});
	});
	req.on('error', e => {
		callback(e);
	});
	if (postData) {
		req.write(postData);
	}
	req.end();
};
