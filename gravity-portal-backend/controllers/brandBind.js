const { handleSuccess, handleFail } = require('../libs/handle.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Brand = require('../models/brand.js');

exports.brandWechatAuth = (req, res, next) => {
	const id = req.params.id;
	const options = {
		hostname: 'gravity.nodejs.top',
		path: `/wechat/auth/${id}`,
		method: 'PUT'
	};
	const postData = 0;
	httpsRequest(options, postData, (err, data) => {
		if (err) return next(err);
		handleSuccess(req, res, `[brand] [wechat] [auth] [brand:${id}]`, data);
	});
};

exports.brandWechatBind = (req, res, next) => {
	const id = req.params.id;
	const wechat = req.body.wechat;
	Brand.findByIdAndUpdate(id, { wechat }, (err, brand) => {
		if (err) return next(err);
		if (!brand) return handleFail(req, res, `[brand] [wechat] [bind] [brand:${id}] [not found]`);
		handleSuccess(req, res, `[brand] [wechat] [bind] [brand:${id}] [wechat:${wechat}]`, { success: 1 });
	});
};

exports.brandFacebookBind = (req, res, next) => {
	const id = req.params.id;
	const options = {
		hostname: 'gravity.nodejs.top',
		path: `/facebook/bind/${id}`,
		method: 'PUT'
	};
	const postData = 0;
	httpsRequest(options, postData, (err, data) => {
		if (err) return next(err);
		if (data.bound) return handleFail(req, res, '[brand] [facebook] [bind] [already bound]', 'brandBound');
		const facebook = data.facebook;
		Brand.findByIdAndUpdate(id, { facebook }, (err, brand) => {
			if (err) return next(err);
			if (!brand) return handleFail(req, res, `[brand] [facebook] [bind] [brand:${id}] [not found]`);
			handleSuccess(req, res, `[brand] [facebook] [bind] [brand:${id}] [facebook:${facebook}]`, 'ok');
		});
	});
};
