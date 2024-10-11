import { useEffect, useState } from "react";
import { hardhat } from "viem/chains";
import { useChainId, usePublicClient } from "wagmi";

const MAINNET_UNISWAP_V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

export const MainnetForkWarning = () => {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [uniswapV2FactoryMissing, setUniswapV2FactoryMissing] = useState(false);

  useEffect(() => {
    const checkUniswapV2Factory = async () => {
      if (chainId !== hardhat.id || !publicClient) {
        setUniswapV2FactoryMissing(false);
        return;
      }

      try {
        const code = await publicClient.getCode({ address: MAINNET_UNISWAP_V2_FACTORY_ADDRESS });
        setUniswapV2FactoryMissing(!code);
      } catch (error) {
        console.error("Error: checkUniswapV2Factory", error);
        setUniswapV2FactoryMissing(false);
      }
    };

    checkUniswapV2Factory();
  }, [chainId, publicClient]);

  if (!uniswapV2FactoryMissing) {
    return null;
  }

  return (
    <div role="alert" className="alert alert-warning">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>
        Use <b>yarn fork</b> instead of <s>yarn chain</s> to create a mainnet fork where Uniswap V2 is deployed!
      </span>
    </div>
  );
};
