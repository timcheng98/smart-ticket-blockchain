const _ = require('lodash');
const config = require('config');
const logger = require('@ikoala/logger');
const db = require('@ikoala/node-mysql-promise');
const mkdirp = require('mkdirp');

const initLogger = function() {
  // logger.init({
  //   console: {
  //     timestamp: function() {
  //       return (new Date());
  //     }
  //   }
  // }).replaceConsole();
};

const initDatabase = function (opts) {
  opts = opts || {};
  db.create('master', config.get('DB.master'));
  if (opts.verbose !== undefined) {
    db.setVerbose(opts.verbose);
  }
};

const createMediaDirectory = () => {
  // mkdirp.sync(config.get('MEDIA.PUBLIC'));
  // mkdirp.sync(config.get('MEDIA.PRIVATE'));
  _.each(config.get('MEDIA'), (dirpath) => {
    mkdirp.sync(dirpath);
  });
};

module.exports = exports = {
  init: () => {
    exports.initLogger();
    exports.initDatabase();
    createMediaDirectory();
  },
  initDatabase,
  initLogger,
};
