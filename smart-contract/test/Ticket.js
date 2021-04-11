const Ticket = artifacts.require('./Ticket.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Ticket', (accounts) => {
  let contract

  before(async () => {
    contract = await Ticket.deployed()
  })

  describe('ticket deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Ticket')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'TCK')
    })

  })

  describe('event and ticket deployment', async () => {
    it('create a new event and create ticket', async () => {
      let detailObj = {
        name: '張敬軒盛樂演唱會',
        venu: '紅磡體育館',
        contact: '+852-56281088',
        email: 'timchengy@gmail.com',
        startDate: 1607701444,
        endDate: 1607701444,
        need_kyc: true,
        country: 'HK',
        district: 'Hung Hom',
        fullAddress: 'Hong Kong Coliseum',
        company: 'XXX Company',
        description: 'XXXX Description',
        totalSupply: 5000,
        performer: '張敬軒',
        category: 'sing',
        startDateSell: 1607701444,
        endDateSell: 1607701444
      };
      await contract.createEvent(accounts[0], JSON.stringify(detailObj));
      // await contract.addApproval(accounts[0]);
      // await contract.addApproval(accounts[1]);

      // let ownerBalance = await contract.eventOwnerBalanceOf(accounts[0]);
      // let eventOwner = await contract.getEventOwner(0);
      // let isApprovel = await contract.isApprovel(accounts[1]);
      // let event_id = await contract.getEventId();
      // assert.equal(event_id, 1)
      // assert.equal(isApprovel, true)
      // assert.equal(eventOwner, accounts[0])
      // assert.equal(ownerBalance, 1)

      let obj = {
        area: 'area1',
        row: 1,
        column: 1,
        seat: `ROW 1 - COL 1`,
        available: true
      }
      await contract.mint([JSON.stringify(obj)]);
    });
  })

  describe('indexing', async () => {
    it('lists tickets', async () => {
      // await contract.safeTransferFrom(accounts[0], accounts[1], 0);
      const owner = await contract.ownerOf(0);
      const tickets = await contract.tickets(0);
      await contract.sellTicketsOnMarketplace(owner, 0);
      let data = await contract.marketplaceTickets(1);
      // await contract.sellTicketsOnMarketplace('0x19EE78BAC3D3b2f9f6c6d162f4347f763021C038', 0);
      const marketplace_ticket = await contract.marketplaceTickets(0);
      // const sell_ticket_owner = await contract.getTicketOnMarketplace(0);
      console.log('data', data)
      console.log('owner', owner)
      console.log('tickets', tickets)
      console.log('marketplace_ticket_before', marketplace_ticket)

      await contract.buyTicketOnMarketplace('0x2804D900ada024996DD187531890eF57ca81FFA8', 0);
      const marketplace_ticket1 = await contract.marketplaceTickets(0);
      const owner_1 = await contract.ownerOf(0);
      console.log('marketplace_ticket1', marketplace_ticket1)
      console.log('owner_1', owner_1)


      await contract.sellTicketsOnMarketplace(owner, 0);

      // console.log('sell_ticket_owner', sell_ticket_owner)
      // for (let i = 0; i <= 4; i++) {
      //   let ticket = await contract.tickets(i)
      //   assert.equal(ticket.eventId, 0)
      //   // console.log(`ticket ${i} >>> `, ticket)
      // }

    })
  })
})
