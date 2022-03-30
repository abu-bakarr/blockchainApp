// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.16 <0.9.0;

// Import Token file to EthExchnage contract
import './Token.sol';

contract EthExchange {
    string public name = "Etha Swap Market";
    Token public token;
    uint public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint rate,
        uint ammount
    );

    event TokensSold(
        address account,
        address token,
        uint rate,
        uint ammount
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyToken() payable public{
        // Redemtion rate = # of token got for 1 etha
        rate;
        // Amount of Etherium * Redemtion rate
        uint tokenAmount = msg.value * rate ;

        // check if balance greater (if statement)
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        //Emit Event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);

    }

    function sellToken( uint _amount) public payable{
        uint etherAmount = _amount /rate;
         
        address payable owner = msg.sender;

        require(address(this).balance >= etherAmount);
        token.transferFrom(msg.sender, address(this), _amount);

        owner.transfer(etherAmount);

        //Emit Token SOld
        emit TokensSold(msg.sender, address(token), _amount, rate);

    }
}