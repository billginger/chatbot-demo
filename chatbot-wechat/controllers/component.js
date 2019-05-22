const Component = require('../models/component.js');

exports.getComponent = (req, res, next) => {
	Component.findOne({}, (err, component) => {
		if (err) return next(err);
		if (!component) return send('No component found!');
		req.component = component;
		next();
	});
};
