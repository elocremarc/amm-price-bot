import {
  ChainId,
  Token,
  WETH,
  Route,
  Trade,
  TokenAmount,
  Fetcher,
  TradeType,
} from "@uniswap/sdk";

import ethers from "ethers";
import dotenv from "dotenv";
import { utils } from "ethers";
import express from "express";
dotenv.config();

const chainId = ChainId.MAINNET;

const stableCoins = {
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  sUSD: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
};

const ERC20 = {
  SNX: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
  UNI: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  SUSHI: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  COMP: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
  BAL: "0xba100000625a3754423978a60c9317c58a424e3D",
  LRC: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
  KNC: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
};

const provider = ethers.getDefaultProvider("homestead", {
  alchemy: process.env.ALCHEMY_API_KEY,
  infura: process.env.INFURA_API_KEY,
  etherscan: process.env.ETHERSCAN_API_KEY,
});

const Price = async (_tokenAddress) => {
  const token = await new Fetcher.fetchTokenData(
    chainId,
    _tokenAddress,
    provider
  );
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(token, weth, provider);
  const route = new Route([pair], weth);
  const trade = new Trade(
    route,
    new TokenAmount(weth, utils.parseEther("1")),
    TradeType.EXACT_INPUT
  );

  let price = trade.executionPrice.toSignificant(6);
  return price;
};

const StableCoin = async () => {
  const stableCoinPrice = [];

  for (const coin in stableCoins) {
    let price = await Price(stableCoins[coin]);
    stableCoinPrice.push(price);
    console.log(`${price} ${coin}`);
  }

  let priceAccum = 0;

  for (let i = 0; i < stableCoinPrice.length; i++) {
    let coinPrice = parseInt(stableCoinPrice[i]);
    priceAccum += coinPrice;
  }
  const averageEthPrice = priceAccum / stableCoinPrice.length;
  console.log("Average Stablecoin ETH Price", averageEthPrice);
};

StableCoin();

console.log("uniswap price per ETH");
for (const token in ERC20) {
  let price = await Price(ERC20[token]);
  console.log(`${price} ${token}`);
}
