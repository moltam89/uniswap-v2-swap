import { useEffect, useState } from "react";
import { UniswapV2PairABI } from "../_helpers/UniswapV2ABIs";
import { WETH9 } from "../_helpers/WETH9";
import { TOKEN_ADDRESSES, getToken, isTokenWETH } from "../_helpers/tokens";
import { getTrade } from "../_helpers/uniswap";
import {
  checkApproval,
  checkEthEnough,
  checkNoPairExists,
  checkSwapPossible,
  checkTokenEnough,
  getDataTipMessage,
  getParsedAmount,
} from "../_helpers/utils";
import { TokenPanel } from "./TokenPanel";
import { Percent, Token, TradeType } from "@uniswap/sdk-core";
import { Trade } from "@uniswap/v2-sdk";
import { Hash, erc20Abi, maxUint256, parseUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";
import {
  useScaffoldContract,
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useTransactor,
  useWatchBalance,
} from "~~/hooks/scaffold-eth";

export const V2Swap = () => {
  const chainId = useChainId();

  const { address: connectedAddress } = useAccount();

  const [tokenAddressA, setTokenAddressA] = useState<string>(zeroAddress);
  const [tokenAddressB, setTokenAddressB] = useState<string>(zeroAddress);
  useEffect(() => {
    const tokenKeys = Object.keys(TOKEN_ADDRESSES[chainId]);
    setTokenAddressA(tokenKeys[0]);
    setTokenAddressB(tokenKeys[1]);

    setAmount("");
  }, [chainId]);

  const tokenA = getToken(chainId, tokenAddressA);
  const tokenB = getToken(chainId, tokenAddressB);

  const [amount, setAmount] = useState<string>("");
  const parsedAmount = getParsedAmount(amount, tokenA);

  const [approveMax, setApproveMax] = useState<boolean>(true);

  const { data: balance } = useWatchBalance({
    address: connectedAddress,
  });
  const { data: balanceA, refetch: refetchBalanceA } = useReadContract({
    abi: erc20Abi,
    address: tokenAddressA,
    args: [connectedAddress || ""],
    functionName: "balanceOf",
    query: {
      enabled: !!connectedAddress && !isTokenWETH(tokenA),
    },
  });
  const { data: balanceB, refetch: refetchBalanceB } = useReadContract({
    abi: erc20Abi,
    address: tokenAddressB,
    args: [connectedAddress || ""],
    functionName: "balanceOf",
    query: {
      enabled: !!connectedAddress && !isTokenWETH(tokenB),
    },
  });

  const { data: pairAddress } = useScaffoldReadContract({
    contractName: "UniswapV2Factory",
    functionName: "getPair",
    args: [tokenAddressA, tokenAddressB],
  });
  const { data: reserves } = useReadContract({
    abi: UniswapV2PairABI,
    address: pairAddress,
    functionName: "getReserves",
  });

  let trade: Trade<Token, Token, TradeType> | undefined;
  if (reserves && parsedAmount) {
    trade = getTrade({ reserves, tokenA, tokenB, parsedAmount });
  }

  const { data: UniswapV2Router02 } = useScaffoldContract({
    contractName: "UniswapV2Router02",
  });
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: tokenAddressA,
    args: [connectedAddress || "", UniswapV2Router02?.address || ""],
    functionName: "allowance",
    query: {
      enabled: !!UniswapV2Router02 && !!connectedAddress && !isTokenWETH(tokenA),
    },
  });

  const isNoPairExists = checkNoPairExists(tokenA, tokenB, pairAddress);

  const isEthEnough = checkEthEnough(trade, balance, parsedAmount, tokenA);
  const isTokenEnough = checkTokenEnough(trade, balance, balanceA, parsedAmount, tokenA);
  const isApproved = checkApproval(allowance, parsedAmount, tokenA);

  const isSwapPossible = checkSwapPossible(trade, isEthEnough, isTokenEnough, isApproved);

  const writeTx = useTransactor();
  const { writeContractAsync: writeERC20Async } = useWriteContract();
  const { writeContractAsync: writeUniswapV2Router02Async } = useScaffoldWriteContract("UniswapV2Router02");

  return (
    <div className="flex flex-col justify-center items-center bg-base-300 w-full mt-8 px-8 pt-6 pb-12">
      <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-full md:w-2/4 rounded-3xl mt-10">
        <h3 className="text-2xl font-bold">Swap Tokens</h3>

        <TokenPanel
          token={tokenA}
          setTokenAddress={setTokenAddressA}
          amount={amount}
          setAmount={setAmount}
          balance={isTokenWETH(tokenA) ? balance?.value : balanceA}
        />
        <TokenPanel
          token={tokenB}
          setTokenAddress={setTokenAddressB}
          amount={trade ? Number(trade.outputAmount.toExact()).toFixed(isTokenWETH(tokenB) ? 4 : 2) : ""}
          balance={isTokenWETH(tokenB) ? balance?.value : balanceB}
          trade={trade}
        />

        <div className="pt-4">
          <div
            className={
              (trade && !isSwapPossible) || isNoPairExists ? "tooltip tooltip-info tooltip-bottom tooltip-open" : ""
            }
            {...((trade && !isSwapPossible) || isNoPairExists
              ? {
                  "data-tip": getDataTipMessage(isNoPairExists, isTokenEnough, isEthEnough, tokenA),
                }
              : {})}
          >
            <button
              className="btn btn-primary text-lg px-12 mt-2"
              disabled={!isSwapPossible}
              onClick={async () => {
                if (!trade) {
                  return;
                }

                const slippageTolerance = new Percent("50", "10000"); // 50 bips, or 0.50%
                const amountOutMin = trade.minimumAmountOut(slippageTolerance).toExact(); // needs to be converted to e.g. decimal string
                const path = [tokenA.address, tokenB.address];
                const to = connectedAddress;
                const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

                let swapResult: Hash | undefined;

                if (tokenA.address === WETH9[chainId].address) {
                  // Swap ETH for tokens
                  swapResult = await writeUniswapV2Router02Async({
                    functionName: "swapExactETHForTokens",
                    args: [parseUnits(amountOutMin, tokenB.decimals), path, to, BigInt(deadline)],
                    value: parsedAmount,
                  });
                } else if (tokenB.address === WETH9[chainId].address) {
                  // Swap tokens for ETH
                  swapResult = await writeUniswapV2Router02Async({
                    functionName: "swapExactTokensForETH",
                    args: [parsedAmount, parseUnits(amountOutMin, tokenB.decimals), path, to, BigInt(deadline)],
                  });
                } else {
                  // Swap tokens for tokens
                  swapResult = await writeUniswapV2Router02Async({
                    functionName: "swapExactTokensForTokens",
                    args: [parsedAmount, parseUnits(amountOutMin, tokenB.decimals), path, to, BigInt(deadline)],
                  });
                }
                console.log("swapResult", swapResult);

                setAmount("");
                refetchBalanceA();
                refetchBalanceB();
                refetchAllowance();
                setApproveMax(true);
              }}
            >
              Swap
            </button>
          </div>
        </div>
        {trade &&
          isEthEnough &&
          isTokenEnough &&
          !isApproved &&
          parsedAmount &&
          connectedAddress &&
          UniswapV2Router02?.address && (
            <div className="flex flex-col pt-12">
              <div>
                <button
                  className="btn btn-primary text-lg px-12 mt-2"
                  onClick={async () => {
                    const approveResult = await writeTx(() =>
                      writeERC20Async({
                        abi: erc20Abi,
                        address: tokenAddressA,
                        functionName: "approve",
                        args: [UniswapV2Router02.address, approveMax ? maxUint256 : parsedAmount],
                      }),
                    );
                    console.log("approveResult", approveResult);

                    refetchAllowance();
                  }}
                >
                  Approve UniswapV2Router02
                </button>
              </div>
              <div className="form-control pt-1">
                <label className="label cursor-pointer">
                  <span className="label-text">{approveMax ? "Approve max" : `Approve ${amount}`}</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-accent"
                    defaultChecked
                    onChange={() => setApproveMax(!approveMax)}
                  />
                </label>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
