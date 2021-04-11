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
    router.get("/api/transaction/all", getAllTransaction);
    router.get("/api/transaction/wallet", getTransactionByWallet);
    router.get("/api/transaction/user", getTransactionByUser);
  },
};

const getAllTransaction = async (req, res) => {
  try {
    let result = await transactionModel.selectTransaction({ all: true });
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTransactionByWallet = async (req, res) => {
  try {
    let result = await transactionModel.selectTransaction({
      where: { sender: req.query.sender },
    });
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
    let result = await transactionModel.selectTransaction({
      where: { user_id: req.query.user_id },
    });
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};
