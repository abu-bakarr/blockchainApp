/* eslint-disable no-undef */
const EthExchange = artifacts.require("EthExchange");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {

    await deployer.deploy(Token);
    const token = await Token.deployed();

    await deployer.deploy(EthExchange);
    const ethExchange = await EthExchange.deployed();


    // Transefer token to EthExchnage
    await token.transfer(ethExchange.address, '1000000000000000000000000')

};