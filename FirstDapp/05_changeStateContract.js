require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(process.env.URLRPCROPSTEN);
var Tx = require('ethereumjs-tx').Transaction;

const ABI = [ { "inputs": [], "name": "retrieve", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "num", "type": "uint256" } ], "name": "store", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];
const SSaddress = "0xfb00b036174dc18fab39bfdd82854af585fa6313";
const simpleStorage = new web3.eth.Contract(ABI, SSaddress);

const account1 = process.env.PUBLICKEY;
const privateKey1 = Buffer.from(process.env.PRIVATEKEY, 'hex');

web3.eth.getTransactionCount(account1, (err, txCount) => {
    const data = simpleStorage.methods.store(3).encodeABI();
    const TxObject = {
        nonce : web3.utils.toHex(txCount),
        gasLimit : web3.utils.toHex(1000000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10','Gwei')),
        to: SSaddress,
        data : data
    }

    var tx = new Tx(TxObject, {'chain' : 'ropsten'});
    tx.sign(privateKey1);

    const serializeTx = tx.serialize();
    const raw = '0x'+serializeTx.toString('hex');

    web3.eth.sendSignedTransaction(raw, (err, TxHash) => {
        console.log('TxHash: ', TxHash, 'Err: ', err);
    })
})
