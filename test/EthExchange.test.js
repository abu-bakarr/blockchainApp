/* eslint-disable no-undef */
const EthExchange = artifacts.require("EthExchange");
const Token = artifacts.require("Token");

require('chai')
    .use(require("chai-as-promised"))
    .should()


function convertToken(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthExchange', (accounts) => {
    let token, ethExchange

    before(async() => {
        token = await Token.new()
        ethExchange = await EthExchange.new()
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
})