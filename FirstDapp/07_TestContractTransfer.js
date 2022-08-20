const { ChainId, Token, WETH, Fetcher, Trade, Route, TokenAmount, TradeType , Percent } = require('@uniswap/sdk');
const { BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ContractTransfer = artifacts.require('ContractTransfer');
const ethers = require('ethers');
require("dotenv").config();

contract ('ContractTransfer', function(accounts) {
    
    const LINKaddress = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
    const recipient = accounts[0];
    const sender = accounts[1];

    const LINKabiContract = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"unfreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"freezeOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"freeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Unfreeze","type":"event"}];

    const provider = ethers.getDefaultProvider('http://localhost:8545');
    const signer = new ethers.Wallet(process.env.PRIVATEKEY); 
    const account = signer.connect(provider);

    describe('Test transferERC20tokens', () => {
        it('transfers the token to sender address', async function() {
            this.ContractTransferInstance = await ContractTransfer.new();
            this.LinkContract = await new ethers.Contract(LINKaddress, LINKabiContract, account ); //Transactions and messages will be signed by sender
            let amount = ethers.BigNumber.from('10000000000000000000');

            //envoyer des ethers au contrat 
            //SWAP amount of ethers to  LINK
            await Swap(LINKaddress, 100, sender);
            //await Swap(LINKaddress, 100, recipient);
            //await Swap(LINKaddress, 100, this.ContractTransferInstance.address);

            // Get balance sender and recipient before send tokens
            let balanceBeforeSender = await this.LinkContract.balanceOf(sender);
            let balanceBeforeRecipient = await this.LinkContract.balanceOf(recipient);

            
            //The sender approve the contract to spend some token's amount
            await this.LinkContract.approve(this.ContractTransferInstance.address, amount, {from : sender});

            //Sender send LINK tokens to recipient
            await this.ContractTransferInstance.transferERC20tokens(LINKaddress, recipient, amount, {from : sender});


            
            // Get balance sender and recipient after send tokens
            let balanceAfterSender = await this.LinkContract.balanceOf(sender);
            let balanceAfterRecipient = await this.LinkContract.balanceOf(recipient);

            // Transform balance and amount to BN openzeppelin
            amount = new BN(amount.toString());
            balanceBeforeSender = new BN(balanceBeforeSender.toString());
            balanceAfterSender = new BN(balanceAfterSender.toString());
            balanceBeforeRecipient = new BN(balanceBeforeRecipient.toString());
            balanceAfterRecipient = new BN(balanceAfterRecipient.toString());

            console.log("Sender");
            console.log(balanceBeforeSender.toString());
            console.log(balanceAfterSender.toString());
            console.log("-------------------------------------");
            console.log("Recipient");
            console.log(balanceBeforeRecipient.toString());
            console.log(balanceAfterRecipient.toString());




            
            expect(balanceBeforeSender).to.be.bignumber.equal(balanceAfterSender.add(amount));
            expect(balanceBeforeRecipient).to.be.bignumber.equal(balanceAfterRecipient.sub(amount));
            
        })
    }
    )
    
})


const Swap = async ( _tokenAddress, _amount, _to) =>  {
    const token = new Token(ChainId.MAINNET, _tokenAddress, 18);

    const pair = await Fetcher.fetchPairData(token, WETH[token.chainId]);
    const route = new Route([pair], WETH[token.chainId]);
    const amountIn = '1000000000000000000'; // 1 WETH
    const trade = new Trade(route, new TokenAmount(WETH[token.chainId], amountIn), TradeType.EXACT_INPUT);
    const slippageTolerance = new Percent('10', '100') // 10 bips, or 0.10%
    
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw ;// needs to be converted to e.g. hex
    const path = [WETH[token.chainId].address, token.address];
    const to = _to; // should be a checksummed recipient address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex
    
    const provider = ethers.getDefaultProvider('http://localhost:8545'); // utilisation du provider infura https://kovan.infura.io/v3/8235e88771864d7a8b201b72fba8a130 effectuer une transaction  
    const signer = new ethers.Wallet(process.env.PRIVATEKEY); // récupérer son wallet grâce au private key
    const account = signer.connect(provider); // récupérer l’account qui va effectuer la transaction 
    
    
    
    const abi = [{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"}];
    const contractUniswap = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', abi, account);
    
    const montant = ethers.BigNumber.from('1000000000000000000');
    const Tx = await contractUniswap.swapExactETHForTokens(String(amountOutMin), path, to , deadline , { value : montant, gasPrice: 20e10, gasLimit: 250000 });
}