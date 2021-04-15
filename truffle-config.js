require('babel-register');
require('babel-polyfill');
const config = require('config');
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: '165.22.251.49',
      port: 7545,
      network_id: "*", // Match any network id,
      gas: 4710000
      // from: '0xB817DA6466Be30CDDE56BDB6aF9349D247798900'
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider([
          '2549de3d53605f909028b6a1baaede4c7e76456a48f732db229ee99c909b4697',
          '0834231b371362dfcb784e722bfd0386cc0fe937e5f706299c496551ad235c52'
        ], "https://ropsten.infura.io/v3/81579e62e21344fb9e8531c070fda670")
      },
      network_id: 3
    }
  },
  contracts_directory: './smart-contract/contracts/',
  contracts_build_directory: './smart-contract/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
// Available Accounts
// ==================
// (0) 0x19EE78BAC3D3b2f9f6c6d162f4347f763021C038 (100 ETH)
// (1) 0x2804D900ada024996DD187531890eF57ca81FFA8 (100 ETH)
// (2) 0x64D7f5Fe6eF78b94a6A1D51Dd2b7C7B48fE4257E (100 ETH)
// (3) 0x7A07E3D004531077577F1C63825c522447452539 (100 ETH)
// (4) 0xED19B2Af0FB152390A017c4f1297021c4C9B4e20 (100 ETH)
// (5) 0x2078301Be41A124737fB97d536f8F55AF7E9A322 (100 ETH)
// (6) 0x693654B833AFA51825B7F5E6610CB02F9d736088 (100 ETH)
// (7) 0x3Ed1651B9521Eb289925d0285332D5321CC04e69 (100 ETH)
// (8) 0xdD69917507d8e7554182aBD98d2f5585654Ba3e9 (100 ETH)
// (9) 0x14Ce90E38a52909317d826a5C259B9D90Ebe4614 (100 ETH)

// Private Keys
// ==================
// (0) 0x999da71ecd57b14e49e398c7ff3f737295e5f85df17961fc22769fa15eae4089
// (1) 0xa1568b6b632e4497d398b5c536474794d08cbce9b88d024c82d8f10dc47ca3b1
// (2) 0xfecd0cab4c3595bd5b1f1562e0e293abb2540b590d76dc5e2ad111639c3abb45
// (3) 0x5442301c00ba31c56f57b6a850aeb
59bd9c5a3a1e42e781d5006881042a65777
// (4) 0xe7e40f87ca871e0b4eb3a475bf951d1e1c1cd6b337f36752311c89463627ca73
// (5) 0x699020486aaecf5abcfa42aa8e9175011a250aa22f45801391b7a5670b0b317f
// (6) 0x4014d94b32be830a4d8216f81ef4138a97eb58d16ceb8e64942ab0a46ed756e3
// (7) 0x9a8822b4587b1faa640771720ac02ca7cb9400727f66ce9ed6361a950dd2d25e
// (8) 0xd722b99c60d1503e47eac3bd84c432b66d2b81b268d52105cf4b293c6972dfbf
// (9) 0x8826d7867f634e0d0c0f2596aacba6beccd2cf0480256faa7eb60dfc1fb3ed70

// HD Wallet
// ==================
// Mnemonic:      river height lock gossip arrive pumpkin fiscal quarter marble strategy copper business
// Base HD Path:  m/44'/60'/0'/0/{account_index}