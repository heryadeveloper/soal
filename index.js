const http = require('http');
const app = require('./src/app');
const logger = require('./src/config/logger');
const config = require('./src/config/config');

const server = http.Server(app);

const port = config.port || 3001;
server.listen(port, () => {
    logger.info(`APP is listening on port ${config.port}`);
})