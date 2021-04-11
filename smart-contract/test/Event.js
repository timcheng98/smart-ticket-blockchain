// const Event = artifacts.require('./Event.sol')

// require('chai')
//   .use(require('chai-as-promised'))
//   .should()

// contract('Event', (accounts) => {
//   let contract

//   before(async () => {
//     contract = await Event.deployed()
//   })

//   describe('deployment', async () => {
//     it('deploys successfully', async () => {
//       const address = contract.address
//       assert.notEqual(address, 0x0)
//       assert.notEqual(address, '')
//       assert.notEqual(address, null)
//       assert.notEqual(address, undefined)
//     })
//   })

//   describe('create event', async () => {

//     it('create a new event', async () => {
//       await contract.createEvent('event_name', 'event_venue', accounts[0]);
//       await contract.createEvent('event_name2', 'event_venue2', accounts[1]);
//       // SUCCESS
//     })

//     it('event', async () => {
//       const result = await contract.events(0);
//       console.log(result)
//       console.log('event id', await contract.getEventId());

//       // SUCCESS
//     })
//   })

// })
