require('dotenv').config();
var Tx     = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3(process.env.URLRPCROPSTEN);

 
const account1 = process.env.PUBLICKEY; // Your account address 1
const privateKey1 = Buffer.from(process.env.PRIVATEKEY, 'hex');
 
// Deploy the contract
web3.eth.getTransactionCount(account1, (err, txCount) => {
    const data = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220d4dbe87ca9034d34315e9ed83d4d46fe7767b201977764ef3ca5a71de14ba55464736f6c634300080b0033';
                    
    const txObject = {
        nonce:    web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(1000000), // Raise the gas limit to a much higher amount
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        data: data
    }
 
    var tx = new Tx(txObject, {'chain':'ropsten'});
    tx.sign(privateKey1)
 
    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')
 
    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
        console.log('txHash:', txHash, 'err:', err)
        // Use this txHash to find the contract on Etherscan!
    })
})
