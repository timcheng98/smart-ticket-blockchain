const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('./index');

const TABLE = {
  event: ['event', 'event_id'],
  event_by_admin: ['event', 'admin_id'],
};

exports.selectEvent = model.createSelect(...TABLE.event);
exports.updateEvent = model.createUpdate(...TABLE.event);
exports.insertEvent = model.createInsert(...TABLE.event);