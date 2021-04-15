const { EventAPI } = require('./eventClass')


const eventAPI = new EventAPI();

exports.createAccount = async () => {
  await eventAPI.init();
  let account = await eventAPI.createAccount()

  return account;
}

exports.decryptAccount = async (keystoreJsonV3, password) => {
  await eventAPI.init();
  console.log('keystoreJsonV3, password', password)
  let account = await eventAPI.decryptAccount(keystoreJsonV3, password)

  return account;
}

exports.getEventAll = async () => {
  await eventAPI.init();
  let events = await eventAPI.getEventAll()

  return events;
}

exports.getEvent = async (eventId) => {
  await eventAPI.init();
  let events = await eventAPI.getEvent(eventId)

  return events;
}

exports.createEvent = async (user, event) => {
  await eventAPI.init();
  return eventAPI.autoSignEventTransaction(user, event);
}

exports.createTicketByEvent = async (user, tickets, eventId) => {
  await eventAPI.init();
  let created_tickets = await eventAPI.autoCreateTicketsByEvent(user, tickets, eventId);
  return created_tickets;
}

exports.getTicketAll = async () => {
  await eventAPI.init();
  let tickets = await eventAPI.getTicketAll()
  return tickets;
}

exports.getTicketOwner = async (ticketId) => {
  await eventAPI.init();
  let tickets = await eventAPI.getTicketOwner(ticketId)
  return tickets;
}

exports.getOwnerTicket = async (address) => {
  await eventAPI.init();
  let tickets = await eventAPI.getOwnerTicket(address)

  return tickets;
}

exports.getOnSellTicketsByArea = async (selectedArea, totalSelectedTicket, eventId) => {
  await eventAPI.init();
  let tickets = await eventAPI.getOnSellTicketsByArea(selectedArea, totalSelectedTicket, eventId)
  return tickets;
}

exports.buyTicket = async (user, address, tickets, total, commission, card) => {
  await eventAPI.init();
  let result = await eventAPI.buyTicket(user, address, tickets, total, commission, card)
  return result;
}

exports.getBuyTicketEstimateGass = async (user, address, tickets, total) => {
  await eventAPI.init();
  let result = await eventAPI.getBuyTicketEstimateGass(user, address, tickets, total)
  return result;
}


exports.sellTicketsOnMarketplace = async (user, seller, ticket_id) => {
  await eventAPI.init();
  let result = await eventAPI.sellTicketsOnMarketplace(user, seller, ticket_id)
  return result;
}

exports.buyTicketOnMarketplace = async (user, buyer, ticket_id, event_id, commission, card, amount) => {
  await eventAPI.init();
  let result = await eventAPI.buyTicketOnMarketplace(user, buyer, ticket_id, event_id, commission, card, amount)
  return result;
}

exports.getBuyTicketOnMarketplaceEstimateGas = async (user, buyer, ticket_id) => {
  await eventAPI.init();
  let result = await eventAPI.getBuyTicketOnMarketplaceEstimateGas(user, buyer, ticket_id)
  return result;
}

exports.getTicketOnMarketplaceAll = async () => {
  await eventAPI.init();
  let result = await eventAPI.getTicketOnMarketplaceAll()
  return result;
}