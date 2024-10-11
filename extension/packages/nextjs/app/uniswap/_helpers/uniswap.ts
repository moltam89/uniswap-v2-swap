import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import { Pair, Route, Trade } from "@uniswap/v2-sdk";

type SwapFunctionParams = {
  reserves: readonly [bigint, bigint, number];
  tokenA: Token;
  tokenB: Token;
  parsedAmount: bigint;
};

export const getTrade = ({
  reserves,
  tokenA,
  tokenB,
  parsedAmount,
}: SwapFunctionParams): Trade<Token, Token, TradeType> => {
  const pair = createPair(tokenA, tokenB, reserves[0], reserves[1]);

  const route = new Route([pair], tokenA, tokenB);

  return new Trade(route, CurrencyAmount.fromRawAmount(tokenA, parsedAmount.toString()), TradeType.EXACT_INPUT);
};

function createPair(tokenA: Token, tokenB: Token, reserve0: bigint, reserve1: bigint): Pair {
  const tokens = [tokenA, tokenB];
  const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]];

  const pair = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
    CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
  );
  return pair;
}
