const log4js = require('log4js');

const FILE_SIZE_10M = 10485760;

const logFile = { type: 'file', maxLogSize: FILE_SIZE_10M, compress: true };
const accessFile = Object.assign({ filename: '/logs/gravity_facebook_access.log' }, logFile);
const appFile = Object.assign({ filename: '/logs/gravity_facebook_app.log' }, logFile);
const errFile = Object.assign({ filename: '/logs/gravity_facebook_error.log' }, logFile);

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
	format: ':method :url :status :content-length :response-timems'
});

module.exports = { log, httpLog };
