const Kyc = artifacts.require('../contracts/Kyc.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('KYC', (accounts) => {
  let contract

  before(async () => {
    contract = await Kyc.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('create user', async () => {
    let sha256 = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    let sha256_2 = 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae';
    let renewSha256 = 'a36a2ce1800626b7cf4751afdc8256807d43467660ae8e444a3f2592b71e454a';
    it('create a new user', async () => {
      await contract.validateUser(1, sha256);
      console.log('create user id 1 success')
      await contract.validateUser(5, sha256_2);
      await contract.validateUser(6, sha256_2);
      await contract.validateUser(7, sha256_2);
      console.log('create user id 5 success');
      // SUCCESS
    })

    it('total user count', async () => {
      const result = await contract.totalUserCount();
      console.log('total user count >>>', result)
      // SUCCESS
    })
    it('get user hash', async () => {
      let result = await contract.getUser(1);
      console.log('user 1 hash value >>>', result)
      result = await contract.getUser(5);
      console.log('user 5 hash value >>>', result)
      // SUCCESS
    })

    it('verify user', async () => {
      const result = await contract.verifyUser(1, sha256);
      console.log('user status >>> ', result)
      // SUCCESS
    })

    it('renew user', async () => {
      const result = await contract.renewUser(1, renewSha256);
      console.log('renew user id 1 success')
      // SUCCESS
    });

    it('get renew user hash', async () => {
      const result = await contract.getUser(1);
      console.log('renew user id 1 hash >>>', result)
      // SUCCESS
    });


    it('burn user', async () => {
      const result = await contract.burnUser(1);
      console.log('burn user id 1 success', result.receipt)
      // SUCCESS
    });


    it('get burn user hash', async () => {
      const result = await contract.getUser(1);
      console.log('burn user id 1 hash >>> ', result)
      // SUCCESS
    });

    it('get target users', async () => {
      let ids = [1, 5];
      const result = await contract.getTotalUser(ids);
      console.log('get target user >>> ', result)
      // SUCCESS
    });
  })

})
