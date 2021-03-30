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
dotenv.config();

const decimals = 18;

const chainId = ChainId.MAINNET;
const tokenAddress = "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F";
const alchemyUrl = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}`;

const provider = ethers.providers.AlchemyProvider(chainId, {
  alchemy: process.env.API_KEY,
});

const init = async () => {
  const token = await new Token(chainId, tokenAddress, decimals);
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(token, weth);
  const route = new Route([pair], weth);
  const trade = new Trade(
    route,
    new TokenAmount(weth, "10000000000000000"),
    TradeType.EXACT_INPUT
  );

  console.log(trade.executionPrice.toSignificant(2));
};

init();
