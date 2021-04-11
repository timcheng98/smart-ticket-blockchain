const models = require('../index');
const db = require('@ikoala/node-mysql-promise');

const TABLE = {
  transaction: 'transaction',
  // admin_role: 'admin_role'
};

exports.selectTransaction = models.createSelect('transaction', 'transaction_id');
exports.updateTransaction = models.createUpdate('transaction', 'transaction_id');
exports.updateTransactionByTxnHash = models.createUpdate('transaction', 'transaction_hash');
exports.insertTransaction = models.createInsert('transaction', 'transaction_id');


exports.selectPaymentTransaction = models.createSelect('payment_transaction', 'ptx_id');
exports.selectPaymentTransactionByUser = models.createSelect('payment_transaction', 'user_id');
exports.selectPaymentTransactionByWallet = models.createSelect('payment_transaction', 'wallet_address');
exports.updatePaymentTransaction = models.createUpdate('payment_transaction', 'ptx_id');
// exports.updatePaymentTransactionByTxnHash = models.createUpdate('payment_transaction', 'transaction_id');
exports.insertPaymentTransaction = models.createInsert('payment_transaction', 'ptx_id');


exports.selectEntryAuditTrail = models.createSelect('entry_audit_trail', 'entry_audit_trail_id');
exports.updateEntryAuditTrail = models.createUpdate('entry_audit_trail', 'entry_audit_trail_id');
exports.insertEntryAuditTrail = models.createInsert('entry_audit_trail', 'entry_audit_trail_id');
