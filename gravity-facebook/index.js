const express = require('express');
const { log, httpLog } = require('./libs/log.js');
const { handleError } = require('./libs/handle.js');
const facebook = require('./routes/facebook.js');

const app = express();

app.use(httpLog);

app.use('/facebook', facebook);

app.use(handleError);

app.listen(3000, () => log.info('Gravity-facebook listening on port 3000!'));
