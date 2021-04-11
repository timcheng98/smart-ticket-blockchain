const Module = module.exports = exports = {};

const util = require('util');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');

const debug = require('debug')('app:model/index');

/**
 * @see {@link https://www.npmjs.com/package/@ikoala/node-mysql-promise}
 */
const db = require('@ikoala/node-mysql-promise');

/**
 * @see {@link https://github.com/iKoala/node-mysql-promise/blob/master/lib/helper.js}
 */
exports.createSelect = db.helper.createSelect;

/**
 * @see {@link https://github.com/iKoala/node-mysql-promise/blob/master/lib/helper.js}
 */
exports.createInsert = (table, primaryKeyField, _cfg) => {
  const cfg = _cfg || {};
  cfg.defaults = _.isPlainObject(cfg.defaults)
    ? _.assign(cfg.defaults, {
      ctime: () => moment().unix(),
      utime: () => moment().unix(),
    }) : {
      ctime: () => moment().unix(),
      utime: () => moment().unix(),
    };
  return db.helper.createInsert(table, primaryKeyField, cfg);
}

/**
 * @see {@link https://github.com/iKoala/node-mysql-promise/blob/master/lib/helper.js}
 */
exports.createUpdate = (table, primaryKeyField, _cfg) => {
  const cfg = _cfg || {};
  cfg.restricts = Array.isArray(cfg.restricts) ? _.concat(cfg.restricts, ['ctime']) : ['ctime'];
  cfg.defaults = _.isPlainObject(cfg.defaults)
    ? _.assign(cfg.defaults, {
      utime: () => moment().unix(),
    }) : {
      utime: () => moment().unix(),
    };
  return db.helper.createUpdate(table, primaryKeyField, cfg)
}

exports.generateCreateTableStatement = function(tableName, dataObj) {
  let stmt = util.format('CREATE TABLE `%s` (', tableName);
  let stmtFieldArr = [
    // '`id` bigint unsigned NOT NULL',
    '`recordId` bigint unsigned NOT NULL',
    '`utime` int unsigned NOT NULL',
    '`ctime` int unsigned NOT NULL',
    '`active` tinyint NOT NULL'
  ];

  _.each(dataObj, function(val, key) {
    if (_.isInteger(val)) {
      return stmtFieldArr.push(util.format('`%s` int NOT NULL', key));
    }

    if (_.isNumber(val)) {
      return stmtFieldArr.push(util.format('`%s` double NOT NULL', key));
    }

    if (_.isString(val)) {
      return stmtFieldArr.push(util.format('`%s` varchar(255) NOT NULL', key));
    }
  });

  stmt += stmtFieldArr.join(', ');

  stmt += util.format(") ENGINE='InnoDB' COLLATE 'utf8_unicode_ci';");

  return stmt;
};

let files = fs.readdirSync(__dirname, {withFileTypes: true});
_.each(files, (file) => {
  let fileObj = path.parse(file.name);
  if ((fileObj.ext === '.js' || file.isDirectory()) && fileObj.name !== 'index') {
    Module[fileObj.name] = require('./' + fileObj.name);
  }
});
