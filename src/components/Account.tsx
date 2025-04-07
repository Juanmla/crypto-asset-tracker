import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useBalance,
} from "wagmi";
import { formatEther } from "viem";
import { useEffect, useState } from "react";
import { Coin } from "../utils/types";

type AccountProps = {
  ethereumData: Coin | undefined;
};

export const Account = ({ ethereumData }: AccountProps) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get native token balance
  const {
    data: balance,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useBalance({ address });
  // Set ETH price
  const ethPrice: number = ethereumData?.current_price ?? 0;

  // Calculate portfolio value
  useEffect(() => {
    const calculatePortfolioValue = () => {
      if (!balance) return 0;
      return parseFloat(formatEther(balance.value)) * ethPrice;
    };

    if (address) {
      setPortfolioValue(calculatePortfolioValue());
    }
  }, [address, balance, ethPrice]);

  return (
    <div className="relative">
      <div
        className="text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Escape" && setIsExpanded(!isExpanded)}
      >
        {ensAvatar && (
          <img
            alt="ENS Avatar"
            src={ensAvatar}
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        <div className="text-left">
          {address && (
            <div className="text-sm">
              {ensName
                ? `${ensName} (${address.substring(0, 4)}...${address.substring(
                    address.length - 4
                  )})`
                : `${address.substring(0, 6)}...${address.substring(
                    address.length - 4
                  )}`}
            </div>
          )}
          <div className="text-xs font-semibold">
            $
            {portfolioValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Portfolio Value</span>
              <span className="font-semibold">
                $
                {portfolioValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {isBalanceLoading ? (
              <div className="py-2 text-sm text-gray-400">
                Loading balance...
              </div>
            ) : balanceError ? (
              <div className="py-2 text-sm text-red-400">
                Error loading balance
              </div>
            ) : (
              balance && (
                <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <span className="font-medium">{balance.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div>
                      {parseFloat(formatEther(balance.value)).toFixed(4)}
                    </div>
                    <div className="text-sm">
                      $
                      {(
                        parseFloat(formatEther(balance.value)) * ethPrice
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              )
            )}

            <button
              onClick={() => disconnect()}
              className="w-full mt-3 px-4 py-2 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-white rounded hover:bg-rose-200 dark:hover:bg-rose-800 text-xs font-medium"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
