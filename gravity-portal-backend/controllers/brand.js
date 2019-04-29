const { handleSuccess, handleFail } = require('../libs/handle.js');
const Brand = require('../models/brand.js');

exports.brandAdd = (req, res) => {
	const name = req.body.name && req.body.name.trim();
	const nameAnyCase = new RegExp(`^${name}$`, 'i');
	Brand.count({ name: nameAnyCase }, (err, count) => {
		if (err) return next(err);
		if (count) {
			const logText = `[brand] [add] [name:${name}] [exist]`;
			return handleFail(req, res, logText, { id: 'msgExist', key: 'labelName', value: name });
		}
		const createdBy = req.profile._id;
		Brand.create({ name, createdBy }, (err, doc) => {
			if (err) return next(err);
			const id = doc._id.toString();
			handleSuccess(req, res, `[brand] [add] [id:${id}] [name:${doc.name}]`, doc);
		});
	});
};