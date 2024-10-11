import { isTokenWETH, isTokensSame } from "./tokens";
import { Token, TradeType } from "@uniswap/sdk-core";
import { Trade } from "@uniswap/v2-sdk";
import { parseEther, parseUnits, zeroAddress } from "viem";

export function isValidAmount(amount: string): boolean {
  try {
    const parsedAmount = parseEther(amount);
    if (parsedAmount <= 0n) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

export function replaceCommaWithPeriod(amount: string): string {
  return amount.replace(/,/g, ".");
}

export function getParsedAmount(amount: string, token: Token): bigint | undefined {
  amount = replaceCommaWithPeriod(amount);

  if (!isValidAmount(amount)) {
    return undefined;
  }

  return parseUnits(amount, token.decimals);
}

export type Balance = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
};

export function checkNoPairExists(tokenA: Token, tokenB: Token, pairAddress: string | undefined): boolean {
  return !isTokensSame(tokenA, tokenB) && pairAddress === zeroAddress;
}

export function checkEthEnough(
  trade: Trade<Token, Token, TradeType> | undefined,
  balance: Balance | undefined,
  parsedAmount: bigint | undefined,
  tokenA: Token,
) {
  if (!trade || !balance || !parsedAmount) {
    return true;
  }

  if (balance.value === 0n) {
    return false;
  }

  if (isTokenWETH(tokenA) && balance.value <= parsedAmount) {
    return false;
  }

  return true;
}

export function checkTokenEnough(
  trade: Trade<Token, Token, TradeType> | undefined,
  balance: Balance | undefined,
  balanceA: bigint | undefined,
  parsedAmount: bigint | undefined,
  tokenA: Token,
): boolean {
  if (!trade || !balance || !parsedAmount) {
    return true;
  }

  if (isTokenWETH(tokenA)) {
    return balance.value >= parsedAmount;
  } else {
    if (balanceA === undefined) {
      return true;
    }

    return balanceA >= parsedAmount;
  }
}

export function checkApproval(allowance: bigint | undefined, parsedAmount: bigint | undefined, tokenA: Token): boolean {
  const requiredAllowance = isTokenWETH(tokenA) ? 0n : parsedAmount;

  if (allowance === undefined || requiredAllowance === undefined) {
    return true;
  }

  return allowance >= requiredAllowance;
}

export function getDataTipMessage(
  isNoPairExists: boolean,
  isTokenEnough: boolean,
  isEthEnough: boolean,
  tokenA: Token,
): string {
  if (isNoPairExists) {
    return "No pair exists for the selected tokens";
  }

  if (!isTokenEnough) {
    return `Insufficient ${tokenA.symbol} balance`;
  } else if (!isEthEnough) {
    return "Insufficient ETH to complete the transaction";
  } else {
    return "Insufficient allowance";
  }
}

export function checkSwapPossible(
  trade: Trade<Token, Token, TradeType> | undefined,
  isEthEnough: boolean,
  isTokenEnough: boolean,
  isApproved: boolean,
): boolean {
  if (!trade) {
    return false;
  }

  return isEthEnough && isTokenEnough && isApproved;
}
