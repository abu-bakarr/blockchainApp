/* eslint-disable no-undef */
import React, { Component } from 'react';
import Web3 from 'web3'
import Navbar from './Navbar'
import Main from './Main'
import './App.css';
import EthExchange from '../abis/EthExchange.json'
import Token from '../abis/Token.json'
class App extends Component {



  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBalance()
  }

  async loadBalance(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    console.log("accounts ", accounts);
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance: ethBalance.toString()})
    console.log("ethBalance ", ethBalance.toString());

    //          Load Token
    // dynamicall get network ID
    const networkId = await web3.eth.net.getId()
    // check if TokenData exists 
    const tokenData = Token.networks[networkId]
    if(tokenData){
      // get ABi Token Contract and Token Address from Abi File
      let token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({token})
      console.log("Token here", this.state.token); 
      // get Token Balance
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({tokenBalance: tokenBalance.toString()})
      console.log("Token Balance", tokenBalance.toString());
    }else{
      window.alert("Token Contract not deployed to netwrok")
    }

        //          Load Token
    // check if EthExchangeData exists 
    const EthExchangeData = EthExchange.networks[networkId]
     // check if EthExchangeData exists
    if(EthExchangeData){
      // get ABi EthExchange Contract and Token Address from Abi File
      let ethExchange = new web3.eth.Contract(EthExchange.abi, EthExchangeData.address);
      this.setState({ethExchange})
      console.log("ethExchange here", this.state.ethExchange); 
    }else{
      window.alert("Token Contract not deployed to netwrok")
    }

    this.setState({loading: false})
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.eth_requestAccounts
    }
    else if (window.web3) {
      window.web3 = new Web3(window.ethereum)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

buyTokens =  (etherAmount) => {
  this.setState({loading: true})
  this.state.ethExchange.methods.buyToken()
        .send({value: etherAmount, from: this.state.account})
        .on('transactionHash',(hash) => {
          this.setState({loading: false})
          })
}
sellTokens =  (tokenAmount) => {
  this.setState({loading: true})
  this.state.token.methods.approve(this.state.ethExchange.address,tokenAmount )
        .send({from: this.state.account})
        .on('transactionHash',(hash) => {
            this.state.ethExchange.methods.sellToken(tokenAmount)
                .send({from: this.state.account})
                .on('transactionHash',(hash) => {
                this.setState({loading: false})
          })
        })
}

constructor(props){
  super(props)
    this.state = {
      account: '',
      ethBalance: '0',
      tokenBalance: '0',
      token: {},
      ethExchange: {},
      loading: true,
    }
}

  render() {
      let content = "";
      if(this.state.loading) {
        content = <p className="text-center">Loading</p>
      }else{
        content = 
        <Main  
            ethBalance={this.state.ethBalance}
            tokenBalance={this.state.tokenBalance}
            buyTokens={this.buyTokens}
            sellTokens={this.sellTokens}
        />
      }

    return (
      <div>
       <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
