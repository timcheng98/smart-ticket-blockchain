const config = require('config');
const configure = require('../configure');
const schedule = require('node-schedule');
const model = require('../model/index');
const _ = require('lodash');
const moment = require('moment');

module.exports = exports = {
  init: () => {
    configure.initLogger();
    configure.initDatabase();
  },
  start: () => {
    // run once when job starts
    // console.info(`Job Started ...`);

    // schedule.scheduleJob('*/1 * * * * *', function() {
    // });

    // run every 5 seconds
    // schedule.scheduleJob('*/5 * * * * *', function() {
    //   UpdateOrder.run();
    // });

    // job every 10 seconds
    // schedule.scheduleJob('*/10 * * * * *', function() {
    // });

    // job every 15 seconds
    // schedule.scheduleJob('*/15 * * * * *', function() {
    // });

    // job every minute
    // schedule.scheduleJob('00 * * * * *', function() {
    // });

    // job every 5 minutes
    // schedule.scheduleJob('00 */5 * * * *', function() {
    // });

    // hourly job @ xx:05
    // schedule.scheduleJob('00 05 * * * *', function() {});

    // daily job @ 00:15
    // schedule.scheduleJob('00 15 00 * * *', () => {
    // });

    // daily job @ 00:00
    // schedule.scheduleJob('00 * * * * *', function() {
    // });
  }
};
