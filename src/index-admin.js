const config = require('config');
const debug = require('debug');

debug.enable(config.DEBUG);

const configure = require('./configure');
configure.init();

// console.log(`__DEV__ >> `, __DEV__);

require('./cms').start();
