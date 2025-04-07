import { useState, useEffect, useMemo } from "react";
import {
  useGetCoinsListQuery,
  useGetPriceHistoryQuery,
} from "./services/coins";
import dayjs from "dayjs";
import { useAccount } from "wagmi";
import { loadFromLocalStorage, saveToLocalStorage } from "./utils/localStorage";
import { normalizeData } from "./utils/normalize";
import { Coin, DaysRangeEnum, type SelectOption } from "./utils/types";

import {
  CryptoSelect,
  Chart,
  WalletOptions,
  Account,
  CryptoStatsBar,
} from "./components/index";

import "./App.css";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function App() {
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [compareCoin, setCompareCoin] = useState<string>("");
  const [daysRange, setDaysRange] = useState<number>(DaysRangeEnum.SEVEN_DAYS);
  const [cachedCoinList, setCachedCoinList] = useState<Coin[]>([]);
  const [showComparison, setShowComparison] = useState<boolean>(false);

  // Fetch the coin list from the API
  const {
    data: coinListData,
    isSuccess: isSuccessGetCoinList,
    error: coinListError,
  } = useGetCoinsListQuery(undefined, { skip: cachedCoinList.length > 0 });

  // Fetch the price history for the selected coin
  const {
    data: priceHistoryData,
    isSuccess: isSuccessGetPriceHistory,
    error: priceHistoryError,
  } = useGetPriceHistoryQuery(
    {
      coinId: selectedCoin,
      days: daysRange,
    },
    { skip: !selectedCoin }
  );

  // Fetch the price history for the comparison coin
  const { data: comparePriceHistoryData } = useGetPriceHistoryQuery(
    {
      coinId: compareCoin,
      days: daysRange,
    },
    { skip: !compareCoin || !showComparison }
  );

  // Load cached coin list if it exists and is fresh - 1 day old
  useEffect(() => {
    const cached = loadFromLocalStorage<Coin[]>("coinListCache", DAY_IN_MS);

    if (cached) {
      setCachedCoinList(cached);
      // skip API call if we have valid cached data
      return;
    }

    // Only fetch if no cache exists
    if (isSuccessGetCoinList && coinListData && !cachedCoinList.length) {
      saveToLocalStorage("coinListCache", coinListData);
      setCachedCoinList(coinListData);
    }
  }, [coinListData, isSuccessGetCoinList, cachedCoinList.length]);

  // Format the coin list data for select options (considering cached data)
  const formattedCoinListData: SelectOption[] = useMemo(() => {
    return cachedCoinList.length
      ? cachedCoinList.map((coin) => ({
          label: coin.name,
          value: coin.id,
          image: coin.image,
        }))
      : [];
  }, [cachedCoinList]);

  // Format the price history data to include date and price
  const formattedPriceHistoryData = useMemo(() => {
    return priceHistoryData?.prices.length
      ? priceHistoryData?.prices.map((price) => ({
          date: dayjs(price[0]).format("YYYY-MM-DD"),
          price: price[1],
          coinId: selectedCoin,
        }))
      : [];
  }, [priceHistoryData, selectedCoin]);

  // Format the price history data if comparison is enabled
  const formattedComparePriceHistoryData = useMemo(() => {
    return comparePriceHistoryData?.prices.length
      ? comparePriceHistoryData.prices.map((price) => ({
          date: dayjs(price[0]).format("YYYY-MM-DD"),
          price: price[1],
          coinId: compareCoin,
        }))
      : [];
  }, [comparePriceHistoryData, compareCoin]);

  // Combine and normalize the price history data for the selected coin and the comparison coin
  const normalizedChartData = useMemo(() => {
    const raw = showComparison
      ? [...formattedPriceHistoryData, ...formattedComparePriceHistoryData]
      : formattedPriceHistoryData;

    return normalizeData(raw).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [
    formattedPriceHistoryData,
    formattedComparePriceHistoryData,
    showComparison,
  ]);

  const ConnectWallet = () => {
    const { isConnected } = useAccount();
    if (isConnected)
      return (
        <Account
          ethereumData={cachedCoinList.find((coin) => coin.id === "ethereum")}
        />
      );
    return <WalletOptions />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center p-5 flex-grow">
        <div className="inline-flex justify-end w-full p-5">
          <ConnectWallet />
        </div>
        <h1>Crypto Asset Tracker</h1>
        <p>Track your favourite crypto</p>
        {coinListError && (
          <div className="text-red-500">
            Error loading coin list: The API is not responding. Please try again
            later.
          </div>
        )}
        {priceHistoryError && (
          <div className="text-red-500">
            Error loading price history: Wait a moment and reload the page.
          </div>
        )}
        <div className="flex flex-col w-4xl items-center gap-4 mt-4">
          <div className="w-sm p-5">
            {!!formattedCoinListData.length && (
              <>
                <CryptoSelect
                  options={formattedCoinListData}
                  onChangeHandler={(option: SelectOption) => {
                    setSelectedCoin(option?.value || "");
                  }}
                />
                <div className="flex items-center mt-2 mb-2">
                  <input
                    type="checkbox"
                    id="compareToggle"
                    checked={showComparison}
                    onChange={() => setShowComparison(!showComparison)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="compareToggle"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Compare with another asset
                  </label>
                </div>

                {showComparison && (
                  <CryptoSelect
                    options={formattedCoinListData.filter(
                      (coin) => coin.value !== selectedCoin
                    )}
                    onChangeHandler={(option: SelectOption) => {
                      setCompareCoin(option?.value || "");
                    }}
                  />
                )}
              </>
            )}
          </div>
          <div className="flex w-full p-5">
            <CryptoStatsBar
              coin={cachedCoinList.find((c) => c.id === selectedCoin)}
              compareCoin={
                showComparison
                  ? cachedCoinList.find((c) => c.id === compareCoin)
                  : undefined
              }
            />
          </div>
          <div className="flex w-full p-5 mb-8">
            {isSuccessGetPriceHistory && (
              <Chart
                data={normalizedChartData}
                daysRange={daysRange}
                setDaysRange={setDaysRange}
                showComparison={showComparison}
                selectedCoin={selectedCoin}
                compareCoin={compareCoin}
              />
            )}
          </div>
        </div>
      </div>
      <footer className="mt-auto text-gray-500 self-center">
        <small>
          Powered by CoinGecko API & Crafted by Juan Manuel Lamperti
        </small>
      </footer>
    </div>
  );
}

export default App;
