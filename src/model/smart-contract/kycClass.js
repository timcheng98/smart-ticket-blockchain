const Web3 = require("web3");
const Kyc = require('../../../smart-contract/abis/Kyc.json');
const _ = require("lodash");
const config = require("config");
const transactionModel = require("./transaction");

const createTransaction = async (obj) => {
  return transactionModel.insertTransaction(obj);
};

export class KycAPI {
  constructor() {
    this.contract = {};
    this.web3 = {};
    this.accounts = [];
    this.address = "";
    this.default_account = config.get("TRUFFLE.OWNER_ACCOUNT.PUBLIC_KEY");
    this.default_account_private_key = config.get(
      "TRUFFLE.OWNER_ACCOUNT.PRIVATE_KEY"
    );
  }

  getWeb3() {
    return this.web3;
  }

  async init() {
    // await this.loadWeb3();
    await this.loadRemoteWeb3();
    await this.loadBlockchainData();
    return true;
  }

  async loadRemoteWeb3() {
    let web3 = new Web3(config.get("TRUFFLE.ORIGIN"));
    this.web3 = web3;
  }

  async loadBlockchainData() {
    // Load accountc
    this.accounts = await this.web3.eth.getAccounts();
    const networkId = await this.web3.eth.net.getId();
    const networkData = Kyc.networks[networkId];
    if (networkData) {
      const abi = Kyc.abi;
      const address = networkData.address;
      this.address = address;
      this.contract = new this.web3.eth.Contract(abi, address);
    } else {
      console.error("Smart contract not deployed to detected network");
      // window.alert('Smart contract not deployed to detected network.');
    }
  }

  async createUserCredential(user, id, hashHex) {
    const transaction = this.contract.methods.validateUser(id, hashHex);
    const dataObj = {
      id,
      hashHex
    }
    return this.signTransaction(
      user,
      transaction,
      function (confirmedMessage) {
        console.log(" user credential confirmedMessage", confirmedMessage);
      },
      dataObj
    );
  }

  async verifyUserCredential(id, hashHex) {
    return this.contract.methods
      .verifyUser(id, hashHex)
      .call({ from: this.accounts[0] });
  }

  async getTotalUserCount() {
    return this.contract.methods
      .getTotalUserCount()
      .call({ from: this.accounts[0] });
  }

  async getTotalUser(ids) {
    return this.contract.methods
      .getTotalUser(ids)
      .call({ from: this.accounts[0] });
  }

  async getUser(id) {
    return this.contract.methods
      .getUser(_.toInteger(id))
      .call({ from: this.accounts[0] });
  }

  async renewUserCredential(user, id, hashHex) {
    const dataObj = {
      id,
      hashHex
    }
    const transaction = this.contract.methods.renewUser(id, hashHex);
    return this.signTransaction(
      user,
      transaction,
      function (confirmedMessage) {
        console.log(" Company credential confirmedMessage", confirmedMessage);
      },
      dataObj
    );
  }

  async burnUserCredential(user, id) {
    const dataObj = {
      id
    }
    const transaction = this.contract.methods.burnUser(id, hashHex);
    return this.signTransaction(
      user,
      transaction,
      function (confirmedMessage) {
        console.log(" Company credential confirmedMessage", confirmedMessage);
      },
      dataObj
    );
  }

  async createCompanyCredential(user, id, hashHex) {
    const dataObj = {
      id,
      hashHex
    }
    const transaction = this.contract.methods.validateCompany(id, hashHex);
    return this.signTransaction(
      user,
      transaction,
      function (confirmedMessage) {
        console.log(" Company credential confirmedMessage", confirmedMessage);
      },
      dataObj
    );
  }

  async verifyCompanyCredential(id, hashHex) {
    return this.contract.methods
      .verifyCompany(id, hashHex)
      .call({ from: this.accounts[0] });
  }

  async getTotalCompanyCount() {
    return this.contract.methods
      .getTotalCompanyCount()
      .call({ from: this.accounts[0] });
  }

  async getTotalCompany(ids) {
    return this.contract.methods
      .getTotalCompany(ids)
      .call({ from: this.accounts[0] });
  }

  async getCompany(id) {
    return this.contract.methods
      .getCompany(id)
      .call({ from: this.accounts[0] });
  }

  async renewCompanyCredential(user, id, hashHex) {
    const dataObj = {
      id,
      hashHex
    }
    const transaction = this.contract.methods.renewCompany(id, hashHex);
    return this.signTransaction(
      user,
      transaction,
      function (confirmedMessage) {
        console.log(" Company credential confirmedMessage", confirmedMessage);
      },
      dataObj
    );
  }

  async burnCompanyCredential(user, id) {
    const dataObj = {
      id
    }
    const transaction = this.contract.methods.burnCompany(id, hashHex);
    return this.signTransaction(
      user,
      transaction,
      function (confirmedMessage) {
        console.log(" Company credential confirmedMessage", confirmedMessage);
      },
      dataObj
    );
  }

  async signTransaction(user, transaction, cb, dataObj) {
    let gas = await transaction.estimateGas({ from: this.default_account });

    let nonce = await this.web3.eth.getTransactionCount(this.default_account);

    let options = {
      to: this.address,
      data: transaction.encodeABI(),
      gas,
      nonce,
    };

    let signedTransaction = await this.web3.eth.accounts.signTransaction(
      options,
      this.default_account_private_key
    );

    console.log("sign step 1 -- signedTransaction", signedTransaction);

    await this.web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction)
      .on("transactionHash", (transactionHash) => {
        console.log("step 2 -- TX Hash: " + transactionHash);
      })
      .on("confirmation", async (confirmationNumber, data) => {
        if (confirmationNumber <= 2) {
          await transactionModel.updateTransactionByTxnHash(
            data.transactionHash,
            {
              confirm_block: confirmationNumber,
            }
          );
        }
        if (confirmationNumber === 2) {
          // await createTransaction(obj);
          cb("Transaction Confirmed");
        }
      })
      .on("receipt", async (receipt) => {
        console.log("receipt", receipt);
        // const decodedParameters = await this.web3.eth.abi.decodeParameters(
        //   typesArray,
        //   receipt.logs[0].data
        // );

        const obj = {
          block_hash: receipt.blockHash,
          block_number: receipt.blockNumber,
          transaction_hash: receipt.transactionHash,
          transaction_index: receipt.transactionIndex,
          sender: receipt.from,
          receiver: receipt.to,
          status: receipt.status ? 1 : 0,
          contract_address: this.address,
          cumulative_gas_used: receipt.cumulativeGasUsed,
          gas_used: receipt.gasUsed,
          logs: JSON.stringify(receipt.logs),
          user_address: "",
          event: JSON.stringify(dataObj),
          confirm_block: 0,
          ...user,
        };

        await createTransaction(obj);
      })
      .on("error", console.error);
  }
}
