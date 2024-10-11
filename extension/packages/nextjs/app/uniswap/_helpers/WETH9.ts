import { Token, WETH9 as uniswapWETH9 } from "@uniswap/sdk-core";
import { base, hardhat, polygon } from "viem/chains";

export const WETH9: { [chainId: number]: Token } = {
  ...uniswapWETH9,
  [hardhat.id]: new Token(hardhat.id, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 18, "WETH", "Wrapped Ether"), // uniswap SDK doesn't store the hardhat WETH address
  [base.id]: new Token(hardhat.id, "0x4200000000000000000000000000000000000006", 18, "WETH", "Wrapped Ether"), // uniswap SDK - old version -  doesn't store the base WETH address
  [polygon.id]: new Token(polygon.id, "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", 18, "WMATIC", "Wrapped MATIC"), // uniswap SDK - old version -  doesn't store the polygon WETH address
};
