const log4js = require('log4js');

log4js.configure({
	appenders: {
		out: { type: 'stdout' },
		access: { type: 'file', filename: '/logs/gravity_facebook_access.log' },
		appFile: { type: 'file', filename: '/logs/gravity_facebook_app.log' },
		app: { type: 'logLevelFilter', appender: 'appFile', level: 'warn', maxLevel: 'warn' },
		errorFile: { type: 'file', filename: '/logs/gravity_facebook_error.log' },
		err: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' }
	},
	categories: {
		default: { appenders: ['out', 'app', 'err'], level: 'debug' },
		http: { appenders: ['out', 'access'], level: 'debug' }
	}
});

const log = log4js.getLogger('app');

const httpLog = log4js.connectLogger(log4js.getLogger('http'), {
	level: 'info',
	format: ':remote-addr :method :url :status :content-length :response-timems'
});

module.exports = { log, httpLog };
