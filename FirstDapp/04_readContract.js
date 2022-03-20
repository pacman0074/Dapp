require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(process.env.URLRPCROPSTEN);
const ABI = [ { "inputs": [], "name": "retrieve", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "num", "type": "uint256" } ], "name": "store", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];
const SSaddress = "0xfb00b036174dc18fab39bfdd82854af585fa6313";
const simpleStorage = new web3.eth.Contract(ABI, SSaddress);
simpleStorage.methods.retrieve().call((err, data) => {
  console.log(data);
});

