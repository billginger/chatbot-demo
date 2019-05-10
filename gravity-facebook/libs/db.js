const mongoose = require('mongoose');
const config = require('../config.js');
const { log } = require('./log.js');

const db_url = config.db_url;

if (!db_url) {
	throw 'Please check config.js!';
}

mongoose.connect(db_url, { useNewUrlParser: true, useFindAndModify: false });

const db = mongoose.connection;
db.on('error', log.error.bind(log, 'MongoDB connection error:'));
db.once('open', () => {
	log.info('MongoDB connection successfully');
});
