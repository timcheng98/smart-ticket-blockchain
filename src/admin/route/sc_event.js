const _ = require("lodash");
const uuid = require("uuid");
const shortid = require("shortid");
const moment = require("moment");
const AppError = require("../../lib/app-error");
const helper = require("../../lib/helper");
const eventModel = require("../../model/smart-contract/event");
const middleware = require("./middleware");
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const debug = require("debug")(`app:event`);
const axios = require("axios");
const ERROR_CODE = {};

AppError.setErrorCode(ERROR_CODE);

function gasFeeToHKD(current_eth, gasUsed) {
  let gas_limit = 21000;
  let gas = gasUsed;
  if (gas_limit < gasUsed) {
    gas = gas_limit
  }
  let GWEI_PER_ETH = 0.000000001;

  let tx_fee = (gasUsed) * GWEI_PER_ETH;
  let gas_fee_per_hkd = (current_eth * tx_fee);
  return _.round(gas_fee_per_hkd, 2);
}


module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/sc/event', middleware.session.authorize());

    router.get("/api/sc/event", getEventAll);
    router.get("/api/sc/event/single", getEvent);
    router.post("/api/sc/event", createEvent);
    router.get("/api/sc/event/ticket", getTicketAll);
    router.get("/api/sc/event/ticket/owner/single", getTicketOwner);
    router.post("/api/sc/event/ticket", createTicket);
    router.post("/api/sc/event/ticket/onsell", getOnSellTicketsByArea);
    router.post("/api/sc/event/ticket/buy", buyTicket);
    router.post("/api/sc/event/ticket/buy/commission", getBuyTicketCommission);
    router.post("/api/sc/event/ticket/owner", getOwnerTickets);
    router.get("/api/sc/event/ticket/marketplace", getTicketOnMarketplaceAll);
    router.post(
      "/api/sc/event/ticket/marketplace/sell",
      sellTicketsOnMarketplace
    );
    router.post("/api/sc/event/ticket/marketplace/buy", buyTicketOnMarketplace);
    router.post(
      "/api/sc/event/ticket/marketplace/buy/commission",
      getBuyTicketOnMarketplaceCommission
    );
    // router.get('/api/sc/event/secret', getSecret);
  },
};

const getEventAll = async (req, res) => {
  try {
    let result = await eventModel.getEventAll();
    // result = _.keyBy(result, 'event_id')
    res.apiResponse({
      status: 1,
      result
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getEvent = async (req, res) => {
  try {
    let result = await eventModel.getEvent(req.query.eventId);
    // result = _.keyBy(result, 'event_id')
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const createEvent = async (req, res) => {
  try {
    if (_.isEmpty(req.body.event)) {
      return res.apiResponse({
        status: -1,
      });
    }
    await eventModel.createEvent(req.user, req.body.event);
    res.apiResponse({
      status: 1,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTicketAll = async (req, res) => {
  try {
    let result = await eventModel.getTicketAll();
    result = _.groupBy(result, "eventId");
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTicketOwner = async (req, res) => {
  try {
    let result = await eventModel.getTicketOwner(req.query.ticketId);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getOwnerTickets = async (req, res) => {
  try {
    let result = await eventModel.getOwnerTicket(req.body.address);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getOnSellTicketsByArea = async (req, res) => {
  try {
    let result = await eventModel.getOnSellTicketsByArea(req.body.selectedArea, req.body.totalSelectedTicket, req.body.eventId);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const buyTicket = async (req, res) => {
  try {
    let result = await eventModel.buyTicket(
      req.user,
      req.body.address,
      req.body.tickets,
      req.body.total,
      req.body.commission,
      req.body.card
    );
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getBuyTicketCommission = async (req, res) => {
  try {
    let result = await eventModel.getBuyTicketEstimateGass(
      req.user,
      req.body.address,
      req.body.tickets,
      req.body.total
    );

    const response = await axios(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=HKD"
    );

    const commission = gasFeeToHKD(response.data.HKD, result.gas);

    res.apiResponse({
      status: 1,
      result: { commission: _.round(commission, 2) },
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const createTicket = async (req, res) => {
  try {
    let { tickets, eventId } = req.body;
    if (!_.isArray(tickets)) {
      return res.apiResponse({
        status: -1,
      });
    }

    await eventModel.createTicketByEvent(req.user, tickets, eventId);
    res.apiResponse({
      status: 1,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const sellTicketsOnMarketplace = async (req, res) => {
  try {
    let { ticketId, seller } = req.body;
    if (!_.isInteger(ticketId)) {
      return res.apiResponse({
        status: -1,
      });
    }

    let result = await eventModel.sellTicketsOnMarketplace(
      req.user,
      seller,
      ticketId
    );
    if (result.status === -1) {
      return res.apiResponse({
        status: -1,
        errorMessage: result.errorMessage,
      });
    }
    res.apiResponse({
      status: 1,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const buyTicketOnMarketplace = async (req, res) => {
  try {
    let { ticketId, buyer } = req.body;
    if (!_.isInteger(ticketId)) {
      return res.apiResponse({
        status: -1,
      });
    }
    let result = await eventModel.buyTicketOnMarketplace(
      req.user,
      buyer,
      ticketId
    );
    if (result.status === -1) {
      return res.apiResponse({
        status: -1,
        errorMessage: result.errorMessage,
      });
    }
    res.apiResponse({
      status: 1,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getBuyTicketOnMarketplaceCommission = async (req, res) => {
  try {
    let { ticketId, buyer } = req.body;
    if (!_.isInteger(ticketId)) {
      return res.apiResponse({
        status: -1,
      });
    }
    let result = await eventModel.getBuyTicketOnMarketplaceEstimateGas(
      req.user,
      buyer,
      ticketId
    );

    const response = await axios(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=HKD"
    );

    const commission = gasFeeToHKD(response.data.HKD, result.gas);
    if (result.status === -1) {
      return res.apiResponse({
        status: -1,
        errorMessage: result.errorMessage,
      });
    }
    res.apiResponse({
      status: 1,
      result: { commission: _.round(commission, 2) },
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getTicketOnMarketplaceAll = async (req, res) => {
  try {
    let { ticketId } = req.query;
    if (!_.isInteger(_.toInteger(ticketId))) {
      return res.apiResponse({
        status: -1,
      });
    }

    let address = await eventModel.getTicketOnMarketplaceAll();
    res.apiResponse({
      status: 1,
      result: address,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getSecret = async (req, res) => {
  try {
    const keyVaultName = process.env["KEY_VAULT_NAME"];
    const KVUri = "https://" + keyVaultName + ".vault.azure.net";

    const credential = new DefaultAzureCredential();
    const client = new SecretClient(KVUri, credential);

    res.apiResponse({ keyVaultName, KVUri, credential, client });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};
