require("dotenv").config();
const express = require("express");
const http = require("http");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const ABI = require("./ABI.js");

// Connect to API Provider
const alchemyUrl = `https://eth-mainnet.alchemyapi.io/v2/`;
const web3 = createAlchemyWeb3(`${alchemyUrl}${process.env.API_KEY}`);

// SERVER CONFIG
const PORT = process.env.PORT || 5000;
const app = express();
const server = http
  .createServer(app)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const tokenContract = new web3.eth.Contract(ABI.TOKEN_ABI, ABI.TOKEN_ADDRESS);
const exchangeContract = new web3.eth.Contract(
  ABI.EXCHANGE_ABI,
  ABI.EXCHANGE_ADDRESS
);

async function blockchainData() {
  const tokenaddress = await tokenContract.methods.totalSupply().call();
  console.log(web3.utils.fromWei(tokenaddress));
  // Check Eth Price
  const price0Last = await exchangeContract.methods
    .price0CumulativeLast()
    .call();
  console.log(web3.utils.fromWei(price0Last));
}

// const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 7000; // 1 Second
// priceMonitor = setInterval(async () => {
//   await blockchainData();
// }, POLLING_INTERVAL);

blockchainData();
