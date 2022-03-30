/* eslint-disable no-undef */
const EthExchange = artifacts.require("EthExchange");
const Token = artifacts.require("Token");

require('chai')
    .use(require("chai-as-promised"))
    .should()

function convertToken(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthExchange', ([deployer, investor]) => {
    let token, ethExchange

    before(async() => {
        token = await Token.new()
        ethExchange = await EthExchange.new(token.address)
        await token.transfer(ethExchange.address, convertToken('1000000'))
    })
    describe('EthExchange deployment', async() => {
        it('contract has a name', async() => {
            const name = await ethExchange.name()
            assert.equal(name, 'Etha Swap Market')
        })
    })
    describe('Token deployment', async() => {
        it('contract has a name', async() => {
            const name = await token.name()
            assert.equal(name, "DApp Token")
        })
    })
    it('contract has tokens', async() => {
        let balance = await token.balanceOf(ethExchange.address)
        assert.equal(balance.toString(), convertToken('1000000'))
    })
    describe('buyTokens()', async() => {
        let result

        before(async() => {
            // buuy tokens
            result = await ethExchange.buyToken({ from: investor, value: web3.utils.toWei('1', 'ether') })
        })

        it('Allows users to buy token from ethExchange for a fix price', async() => {
            // check inveestor balance after purchase
            let inverstorBalance = await token.balanceOf(investor)
            assert.equal(inverstorBalance.toString(), convertToken('100'))

            let ethExchangeBalance
            ethExchangeBalance = await token.balanceOf(ethExchange.address)
            assert.equal(ethExchangeBalance.toString(), convertToken('999900'))
            ethExchangeBalance = await web3.eth.getBalance(ethExchange.address)
            assert.equal(ethExchangeBalance.toString(), web3.utils.toWei('1', 'Ether'))

            // console.log("here", result.logs[0].args.ammount)
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.ammount.words[0].toString(), convertToken('100').toString())
            assert.equal(event.rate.words[0].toString(), '100')
        })
    })

    describe('sellToken()', async() => {
        let result

        before(async() => {
            // Investor must approve the purchase
            await token.approve(ethExchange.address, convertToken('100'), { from: investor })
                // sell tokens
            result = await ethExchange.sellToken(convertToken('100'), { from: investor })
        })

        it('Allows users to sell token to ethExchange for a fix price', async() => {
            // check inveestor balance after sell toke
            let inverstorBalance = await token.balanceOf(investor)
            assert.equal(inverstorBalance.toString(), convertToken('0'))

            //Users cant sell more tokens than they have
            require(token.balanceOf(msg.sender) >= _amount)

            // Check ethExchnage balance after sell
            let ethExchangeBalance = await token.balanceOf(ethExchange.address)
            assert.equal(ethExchangeBalance.toString(), convertToken('1000000'))
            ethExchangeBalance = await web3.eth.getBalance(ethExchange.address)
            assert.equal(ethExchangeBalance.toString(), web3.utils.toWei('0', 'Ether'))

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.ammount.words[0].toString(), convertToken('100').toString())
            assert.equal(event.rate.words[0].toString(), '100')

            //Test failure investors cant sell more than thier token
            await ethExchange.sellToken(convertToken('500'), { from: investor }).should.be.rejected;

        })
    })
})