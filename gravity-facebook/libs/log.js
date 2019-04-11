const log4js = require('log4js');

log4js.configure({
	appenders: { out: { type: 'stdout' } },
	categories: { default: { appenders: ['out'], level: 'debug' } }
});

const log = log4js.getLogger('app');

const httpLog = log4js.connectLogger(log4js.getLogger('http'), {
	level: 'info',
	format: ':remote-addr :method :url :status :content-length :response-timems'
});

module.exports = { log, httpLog };
