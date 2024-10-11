import { Token, WETH9 as uniswapWETH9 } from "@uniswap/sdk-core";
import { hardhat } from "viem/chains";

export const WETH9: { [chainId: number]: Token } = {
  ...uniswapWETH9,
  [hardhat.id]: new Token(hardhat.id, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 18, "WETH", "Wrapped Ether"),
};
