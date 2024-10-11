import { WETH9 } from "./WETH9";
import { Token } from "@uniswap/sdk-core";
import { Address } from "viem";
import { arbitrum, base, hardhat, mainnet, optimism, polygon } from "viem/chains";

const MAINNET_ADDRESSES = {
  [WETH9[mainnet.id].address]: { name: "ETH", decimals: 18 },
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": { name: "DAI", decimals: 18 },
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": { name: "USDC", decimals: 6 },
};

export const TOKEN_ADDRESSES: { [chainId: number]: { [address: string]: { name: string; decimals: number } } } = {
  [hardhat.id]: MAINNET_ADDRESSES, // hardhat fork mainnet
  [mainnet.id]: MAINNET_ADDRESSES,
  [arbitrum.id]: {
    [WETH9[arbitrum.id].address]: { name: "ETH", decimals: 18 },
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": { name: "DAI", decimals: 18 },
    "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": { name: "USDC", decimals: 6 },
    "0x912CE59144191C1204E64559FE8253a0e49E6548": { name: "ARB", decimals: 18 },
  },
  [base.id]: {
    [WETH9[base.id].address]: { name: "ETH", decimals: 18 },
    "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb": { name: "DAI", decimals: 18 },
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": { name: "USDC", decimals: 6 },
  },
  [optimism.id]: {
    [WETH9[optimism.id].address]: { name: "ETH", decimals: 18 },
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": { name: "DAI", decimals: 18 },
    "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85": { name: "USDC", decimals: 6 },
    "0x4200000000000000000000000000000000000042": { name: "OP", decimals: 18 },
  },
  [polygon.id]: {
    [WETH9[polygon.id].address]: { name: "MATIC", decimals: 18 },
    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063": { name: "DAI", decimals: 18 },
    "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359": { name: "USDC", decimals: 6 },
  },
};

export function getToken(chainId: number, tokenAddress: Address): Token {
  let tokenData = TOKEN_ADDRESSES[chainId][tokenAddress];

  if (!tokenData) {
    tokenData = { name: "Unknown", decimals: 18 };
  }

  return new Token(chainId, tokenAddress, tokenData.decimals, tokenData.name);
}

export function isTokenWETH(token: Token): boolean {
  return token.address === WETH9[token.chainId].address;
}

export function isTokensSame(tokenA: Token, tokenB: Token): boolean {
  return tokenA.address === tokenB.address;
}
