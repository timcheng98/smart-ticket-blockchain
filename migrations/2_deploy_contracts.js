const Event = artifacts.require("Event");
const Ticket = artifacts.require("Ticket");
const Kyc = artifacts.require("Kyc");

module.exports = function(deployer) {
  deployer.deploy(Event);
  deployer.deploy(Ticket);
  deployer.deploy(Kyc);
};
