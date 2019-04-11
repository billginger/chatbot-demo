const express = require('express');
const { log, httpLog } = require('./libs/log.js');

const app = express();

app.use(httpLog);
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/webhook', (req, res) => {
	log.info('WEBHOOK_VERIFIED');
	res.send('ok');
});

app.listen(3000, () => log.info('Example app listening on port 3000!'));
