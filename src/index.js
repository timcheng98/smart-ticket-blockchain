const config = require('config');
const debug = require('debug');

debug.enable(config.DEBUG);

const configure = require('./configure');

configure.init();

require('./api').start();
require('./job').start();
require('./admin').init('ADMIN').start();
