const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const cookieParser = require('cookie-parser');
const { log, httpLog } = require('./libs/log.js');
const { handleError } = require('./libs/handle.js');
const router = require('./routes/index.js');
require('./libs/db.js');

const app = express();

app.use(httpLog);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router);
app.use(handleError);

if (cluster.isMaster) {
	log.info(`The master process is listening on port 3000 with pid ${process.pid}!`);
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', (worker, code, signal) => {
		let reason = 'unknow reason';
		if (code) {
			reason = `code ${code}`;
		}
		if (signal) {
			reason = `signal ${signal}`;
		}
		log.error(`A worker process has exited with pid ${worker.process.pid} caused ${reason}!`);
	});
} else {
	app.listen(3000, () => log.info(`A worker process is listening on port 3000 with pid ${process.pid}!`));
}
