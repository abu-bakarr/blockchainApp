/* eslint-disable no-undef */
import React, { Component } from 'react';
import Web3 from 'web3'
import Navbar from './Navbar'
import Main from './Main'
import './App.css';
import EthExchange from '../abis/EthExchange.json'
import Token from '../abis/Token.json'
class App extends Component {

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


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBalance()
  }

  async loadBalance(){
   
    const myWeb3 = await new Web3(window.ethereum);

    const accounts = await myWeb3.eth.getAccounts()
    this.setState({account: accounts[0]})
    console.log("accounts ", accounts[0]);
    // const ethBalance = await myWeb3.eth.getBalance(this.state.account)
    const ethBalance = await new myWeb3.eth.getBalance(this.state.account.toString())
    this.setState({ethBalance: ethBalance})
    console.log("ethBalance ", ethBalance);

    //          Load Token
    // dynamicall get network ID
    const networkId = await new myWeb3.eth.net.getId()
    // check if TokenData exists 
    const tokenData = await Token.networks[networkId]
    console.log("tokenData here", tokenData); 
    if(tokenData){
      // get ABi Token Contract and Token Address from Abi File
      let token = await new myWeb3.eth.Contract(Token.abi, tokenData.address);
      this.setState({token});
      console.log(" Token=", token); 
      // get Token Balance
      // let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      let tokenBalance = await token.methods.balanceOf(this.state.account.toString()).call()
      this.setState({tokenBalance: tokenBalance})
      console.log("Token Balance", await token.methods.balanceOf(this.state.account.toString()).call());
    }else{
      window.alert("Token Contract not deployed to netwrok")
    }

        //          Load Token
    // check if EthExchangeData exists 
    const EthExchangeData = EthExchange.networks[networkId]
    // check if EthExchangeData exists
    if(EthExchangeData){
      // get ABi EthExchange Contract and Token Address from Abi File
      let ethExchange = await new myWeb3.eth.Contract(EthExchange.abi, EthExchangeData.address);
      this.setState({ethExchange})
      console.log("ethExchange here", ethExchange); 
    }else{
      window.alert("Token Contract not deployed to netwrok")
    }

    this.setState({loading: false})
  }

  async loadWeb3() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.eth_requestAccounts
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
