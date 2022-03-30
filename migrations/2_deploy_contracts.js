/* eslint-disable no-undef */
const EthExchange = artifacts.require("EthExchange");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {

    await deployer.deploy(Token);
    const token = await Token.deployed();

    // passing token.address to EthExchnage contract coz of the imported token
    await deployer.deploy(EthExchange, token.address);
    const ethExchange = await EthExchange.deployed();


    // Transefer token to EthExchnage
    await token.transfer(ethExchange.address, '1000000000000000000000000')

};