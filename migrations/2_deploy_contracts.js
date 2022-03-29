/* eslint-disable no-undef */
const EthExchange = artifacts.require("EthExchange");

module.exports = function(deployer) {
    deployer.deploy(EthExchange);
};