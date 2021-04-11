const path = require('path');
const config = require('config');
const WebServer = require('../web-server');

const router = require('./route').getRouter();

let env = config.util.getEnv('NODE_ENV');
let webConfig = config.get('API');

const startWebServer = function () {
  WebServer.createServer({
    port: process.env.PORT || webConfig.PORT,
    mount: (webConfig.MOUNT) ? webConfig.MOUNT : null,
    viewsPath: [
      path.join(__dirname, 'client', "src")
    ],
    staticPath: [
      path.join(__dirname, 'client', 'public', (env === 'production') ? 'dist' : 'dev'),
      path.join(__dirname, 'client', 'public'),
      path.join(config.get('MEDIA.PUBLIC')),
      // path.join(config.get('MEDIA.PUBLIC')),
    ],
    sessionSecret: webConfig.SESSION_SECRET,
    mysql: config.get('DB.master'),
    router,
  });
};

module.exports = exports = {
  start: () => {
    startWebServer();
  }
};
