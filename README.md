# Uniswap V2 Swap Extension for Scaffold-ETH 2

This [Scaffold-ETH-2 extension](https://docs.scaffoldeth.io/extensions/) enables users to swap tokens using [Uniswap V2](https://docs.uniswap.org/contracts/V2/concepts/protocol-overview/how-uniswap-works).  
It leverages the Uniswap V2 SDK to manage token swaps, offering a simple and intuitive user interface for performing token exchange transactions.

## 🏗 Installation

```
npx create-eth@latest -e moltam89/uniswap-v2-swap
```

## 🚀 Setup extension

```
yarn fork
```
This command creates a local fork of the mainnet, allowing you to work with a simulated environment where Uniswap V2 is already deployed. Running yarn fork allows you to interact with the Uniswap contracts directly in a development environment, testing your token swaps with real mainnet data without the need to spend actual funds. This is especially useful for testing and debugging.


```
yarn start
```
Visit your app on: `http://localhost:3000`. You can swap tokens on the `Uniswap` page.

## 🛠️ Configuration

### 🛰️ Networks

You can configure the network settings in `packages/nextjs/scaffold.config.ts`. By default, the target network is set to either`[chains.hardhat]` or `[chains.foundry]`.

If you want to configure multiple networks, it can be set like this:  
`targetNetworks: [chains.hardhat, chains.mainnet, chains.arbitrum, chains.base, chains.optimism, chains.polygon]`

### 🪙 Tokens

You can configure the available tokens for swapping in the `packages/nextjs/app/uniswap/_helpers/tokens.ts` file. Here, you can set the token addresses, names, and decimals for each supported network. 
By default **DAI** and **USDC** are configured. Here’s an example configuration to include the **OP** token on the Optimism network:
```
[optimism.id]: {
    [WETH9[optimism.id].address]: { name: "ETH", decimals: 18 },
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": { name: "DAI", decimals: 18 },
    "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85": { name: "USDC", decimals: 6 },
    "0x4200000000000000000000000000000000000042": { name: "OP", decimals: 18 },
  },
```
___
https://github.com/user-attachments/assets/b0b6dc53-7a40-4168-be29-2f17b1dfb4c2

