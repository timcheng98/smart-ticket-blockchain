const _ = require("lodash");
const uuid = require("uuid");
const shortid = require("shortid");
const moment = require("moment");
const AppError = require("../../lib/app-error");
const helper = require("../../lib/helper");
const kycModel = require("../../model/smart-contract/kyc");
const middleware = require("./middleware");
const debug = require("debug")(`app:event`);

const ERROR_CODE = {};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/sc/event', middleware.session.authorize());

    router.get("/api/sc/kyc/user", getUserIdentity);
    router.get("/api/sc/kyc/user/total", getTotalUserCount);
    router.post("/api/sc/kyc/user/target", getTargetUserIdentity);
    router.post("/api/sc/kyc/user/verify", verifyUserCredential);
    router.post("/api/sc/kyc/user/credential/create", createUserCredential);
    router.post("/api/sc/kyc/user/credential/renew", renewUserCredential);
    router.post("/api/sc/kyc/user/credential/burn", burnUserCredential);
  },
};

const getUserIdentity = async (req, res) => {
  try {
    const { user_id } = req.query;
    console.log(user_id);
    let result = await kycModel.getUserIdentity(user_id);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTotalUserCount = async (req, res) => {
  try {
    let result = await kycModel.getTotalUserCount();
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTargetUserIdentity = async (req, res) => {
  try {
    const { ids } = req.body;
    let result = await kycModel.getTargetUserIdentity(ids);
    let data = [];
    result.map((item, index) => {
      data.push({ user_id: ids[index], user_credential: item });
    });
    res.apiResponse({
      status: 1,
      result: data,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const verifyUserCredential = async (req, res) => {
  try {
    const { id, hashHex } = req.body;
    let result = await kycModel.verifyUserCredential(id, hashHex);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const createUserCredential = async (req, res) => {
  try {
    const { admin_id, id, hashHex } = req.body;
    let result = await kycModel.createUserCredential({ admin_id }, id, hashHex);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const renewUserCredential = async (req, res) => {
  try {
    const { admin_id, id, hashHex } = req.body;
    let result = await kycModel.renewUserCredential({ admin_id }, id, hashHex);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const burnUserCredential = async (req, res) => {
  try {
    const { admin_id, id, hashHex } = req.body;
    let result = await kycModel.burnUserCredential({ admin_id }, id, hashHex);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};
