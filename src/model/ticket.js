const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('./index');
const _  = require('lodash')

const TABLE = {
  ticket: ['ticket', 'ticke'],
  event_by_admin: ['ticket', 'admin_id'],
};

exports.selectTicket = model.createSelect('ticket', 'ticket_id');
exports.updateTicket = model.createUpdate('ticket', 'ticket_id');
exports.insertTicket = model.createInsert('ticket', 'ticket_id');

exports.insertTicketArray = async ({tickets, event_id, admin_id}) => {
  let values = [];
  let now = moment().unix();
  _.map(tickets, ({ area, row, column, seat, available, type, price }) => {
    let value = `(${event_id}, "${area}", ${_.toInteger(row)}, ${_.toInteger(column)}, "${seat}", ${available ? 1 : 0}, "${type}", ${_.toNumber(price)}, ${now}, ${now}, ${admin_id})`;
    values.push(value);
  });
  let sql = `INSERT INTO ticket (event_id, area, ticket_row, ticket_col, seat, available, type, price, ctime, utime, admin_id) VALUES ${_.join(values, ',')}`;
  return db.query(sql);
}

