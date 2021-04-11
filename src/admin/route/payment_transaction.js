const _ = require("lodash");
const uuid = require("uuid");
const shortid = require("shortid");
const moment = require("moment");
const AppError = require("../../lib/app-error");
const helper = require("../../lib/helper");
const transactionModel = require("../../model/smart-contract/transaction");
const middleware = require("./middleware");
const debug = require("debug")(`app:event`);

const ERROR_CODE = {};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/sc/event', middleware.session.authorize());
    router.get("/api/payment/transaction/all", getAllTransaction);
    router.get("/api/payment/transaction/wallet", getTransactionByWallet);
    router.get("/api/payment/transaction/user", getTransactionByUser);
    router.post("/api/payment/transaction", createPaymentTransaction);
  },
};

const getAllTransaction = async (req, res) => {
  try {
    let result = await transactionModel.selectPaymentTransaction({ all: true });
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getTransactionByWallet = async (req, res) => {
  try {
    let result = await transactionModel.selectPaymentTransactionByWallet(req.query.sender);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTransactionByUser = async (req, res) => {
  try {
    let result = await transactionModel.selectPaymentTransactionByUser(req.query.user_id);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};


const createPaymentTransaction = async (req, res) => {
  try {
    let obj = {
      transaction_id: 0,
      ptx_key: `TCK${req.user.user_id}${moment.unix()}`,
      user_id: req.user.user_id,
      wallet_address: '',
      amount: 0,
      event_id: -1,
      ticket_id: -1,
      credit_card_number: '',
      ...req.body
    }
    let result = await transactionModel.insertPaymentTransaction(obj);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};
 