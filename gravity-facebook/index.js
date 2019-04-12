const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const { log, httpLog } = require('./libs/log.js');
const { handleError } = require('./libs/handle.js');
const facebook = require('./routes/facebook.js');

const app = express();

app.use(httpLog);

app.use('/facebook', facebook);

app.use(handleError);

if (cluster.isMaster) {
	log.debug(numCPUs);
	log.info('App master process listening on port 3000 with pid', process.pid);
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
} else {
	app.listen(3000, () => log.info('App worker process listening on port 3000 with pid', process.pid));
}
