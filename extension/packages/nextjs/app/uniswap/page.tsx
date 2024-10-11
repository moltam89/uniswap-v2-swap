"use client";

import { MainnetForkWarning } from "./_components/MainnetForkWarning";
import { V2Swap } from "./_components/V2Swap";
import type { NextPage } from "next";

const UniswapV2: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 text-center max-w-4xl">
          <h1 className="text-4xl font-bold">Uniswap V2</h1>
          <div>
            <p>
              This extension shows you how to swap tokens using{" "}
              <a
                target="_blank"
                href="https://docs.uniswap.org/contracts/V2/concepts/protocol-overview/how-uniswap-works"
                className="underline font-bold text-nowrap"
              >
                Uniswap V2
              </a>
            </p>
          </div>

          <div className="divider my-0" />

          <MainnetForkWarning />
        </div>

        {<V2Swap />}
      </div>
    </>
  );
};

export default UniswapV2;
