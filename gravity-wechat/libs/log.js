const log4js = require('log4js');
const config = require('../config.js');

const log_file_access = config.log_file_access;
const log_file_access_format = config.log_file_access_format;
const log_file_app = config.log_file_app;
const log_file_error = config.log_file_error;
const log_file_size_max = config.log_file_size_max;

if (!log_file_access || !log_file_access_format || !log_file_app || !log_file_error || !log_file_size_max) {
	throw 'Please check config.js!';
}

const logFile = { type: 'file', maxLogSize: log_file_size_max, compress: true };
const accessFile = Object.assign({ filename: log_file_access}, logFile);
const appFile = Object.assign({ filename: log_file_app }, logFile);
const errFile = Object.assign({ filename: log_file_error }, logFile);

log4js.configure({
	appenders: {
		out: { type: 'stdout' },
		access: accessFile,
		appFile,
		app: { type: 'logLevelFilter', appender: 'appFile', level: 'debug', maxLevel: 'warn' },
		errFile,
		err: { type: 'logLevelFilter', appender: 'errFile', level: 'error' }
	},
	categories: {
		default: { appenders: ['out', 'app', 'err'], level: 'debug' },
		http: { appenders: ['out', 'access'], level: 'debug' }
	}
});

const log = log4js.getLogger('app');

const httpLog = log4js.connectLogger(log4js.getLogger('http'), {
	level: 'info',
	format: log_file_access_format
});

module.exports = { log, httpLog };
