### Smart Ticket Blockchain Server

------------


#### Initialization
##### Install Truffle
> $ npm install -g truffle

###### open truffle-config.js
###### overide the host which is the docker - ganache's ip address
 - development: {
      host: 'xxx.xxx.xxx.xxx',
      port: 7545,
      network_id: "*", // Match any network id,
      gas: 4710000
      // from: '0xB817DA6466Be30CDDE56BDB6aF9349D247798900'
    },


------------


##### Setup Docker
> $ docker run -v smart-ticket:your_project_directory --detach --publish 7545:7545  trufflesuite/ganache-cli:latest --accounts 10 --gasLimit=0x1fffffffffffff -p 7545 --networkId 1337 -m "river height lock gossip arrive pumpkin fiscal quarter marble strategy copper business" --acctKeys your_project_directory/Keys.json --db your_project_directory/chain-db

###### How to find the owner key?
> $  docker volume inspect smart-ticket-blockchain

###### copy the Mountpoint path and go to the path, you can open the Key.json to view the key pair
> $ cd your_the_mountpoint_path

------------


##### Setup Environment
> $ cd config
> $ cp default.js local.js

open local.js set up the environment to overide default.js

- DB - host, user, password, and database
- "TRUFFLE": {
    "PORT": 7545,
    "HOST": "xxx.xxx.xxx.xxx",
    "ORIGIN": "http://xxx.xxxx.xxx.xxx:7545",
    "OWNER_ACCOUNT": { 
     "PUBLIC_KEY": "0x19EE78BAC3D3b2f9f6c6d162f4347f763021C038", 
     "PRIVATE_KEY": "0x999da71ecd57b14e49e398c7ff3f737295e5f85df17961fc22769fa15eae4089"
    }
  },

> $ npm ci

------------



#### Development

Start Server:

> $ npm run dev

