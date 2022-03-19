const Web3 = require('web3');
const rpcURL = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const web3 = new Web3(rpcURL);
 
web3.eth.getBalance("0x08832a93c5bafF98c27ddb6bDb23E7A7Bd7708Ef", (err, wei) => { 
   balance = web3.utils.fromWei(wei, 'ether'); // convertir la valeur en ether
   console.log(balance);
});
