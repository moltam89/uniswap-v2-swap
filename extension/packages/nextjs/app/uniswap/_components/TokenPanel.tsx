import { TOKEN_ADDRESSES, isTokenWETH } from "../_helpers/tokens";
import { PriceImpactWarning } from "./PriceImpactWarning";
import { TokenSelector } from "./TokenSelector";
import { Token, TradeType } from "@uniswap/sdk-core";
import { Trade } from "@uniswap/v2-sdk";
import { formatUnits } from "viem";

interface TokenInputProps {
  trade?: Trade<Token, Token, TradeType> | undefined;
  token: Token;
  setTokenAddress: (address: string) => void;
  amount: string;
  setAmount?: ((address: string) => void) | undefined;
  balance: bigint | undefined;
}

export const TokenPanel = ({ trade, token, setTokenAddress, amount, setAmount, balance }: TokenInputProps) => {
  let fractionDigits = 2;
  if (isTokenWETH(token)) {
    fractionDigits = 4;
  }

  return (
    <div className="w-8/12 pt-4">
      <div className="flex justify-between space-x-4">
        <div className="flex-grow flex space-x-4 font-bold">
          <input
            type="text"
            disabled={setAmount === undefined}
            value={amount}
            onChange={event => setAmount && setAmount(event.target.value)}
            placeholder="0"
            className="input w-full"
          />
          <TokenSelector
            tokenAddress={token.address}
            setTokenAddress={setTokenAddress}
            tokenAddresses={TOKEN_ADDRESSES[token.chainId]}
          />
        </div>
      </div>
      <div className="flex justify-between text-sm pt-1 ">
        <PriceImpactWarning priceImpact={Number(trade?.priceImpact.toSignificant(4))} />

        <div>
          Balance:{" "}
          <span className="font-bold">
            {balance ? Number(formatUnits(balance, token.decimals)).toFixed(fractionDigits) : 0}
          </span>
        </div>
      </div>
    </div>
  );
};
