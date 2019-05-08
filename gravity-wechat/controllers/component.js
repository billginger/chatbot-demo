const Component = require('../models/component.js');

exports.getComponent = (req, res, next) => {
	Component.findOne({}, (err, doc) => {
		if (err) return next(err);
		if (!doc) return send('No component found!');
		req.component = doc;
		next();
	});
};
