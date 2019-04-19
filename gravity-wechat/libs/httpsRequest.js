const https = require('https');

module.exports = (options, postData, callback) => {
	options.headers['Content-Length'] = Buffer.byteLength(postData);
	const req = https.request(options, res => {
		let data = '';
		res.on('data', d => {
			data += d;
		});
		res.on('end', () => {
			try {
				const json = JSON.parse(data);
				console.log('data:');
				console.log(data);
				console.log(typeof data);
				console.log('json:');
				console.log(json);
				console.log(typeof json);
				callback(0, json);
			} catch(err) {
				console.log('data:');
				console.log(data);
				console.log(typeof data);
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
