import { useState, useEffect, useMemo } from "react";
import {
  useGetCoinsListQuery,
  useGetPriceHistoryQuery,
} from "./services/coins";
import dayjs from "dayjs";
import { loadFromLocalStorage, saveToLocalStorage } from "./utils/localStorage";
import { useAccount } from "wagmi";

import CryptoSelect from "./components/CryptoSelect";
import Chart from "./components/Chart";
import WalletOptions from "./components/WalletOptions";
import Account from "./components/Account";
import { Coin, DaysRangeEnum, type SelectOption } from "./utils/types";

import "./App.css";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function App() {
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [daysRange, setDaysRange] = useState<number>(DaysRangeEnum.SEVEN_DAYS);
  const [cachedCoinList, setCachedCoinList] = useState<Coin[]>([]);

  const { data: coinListData, isSuccess: isSuccessGetCoinList } =
    useGetCoinsListQuery();
  const { data: priceHistoryData, isSuccess: isSuccessGetPriceHistory } =
    useGetPriceHistoryQuery(
      {
        coinId: selectedCoin,
        days: daysRange,
      },
      { skip: !selectedCoin }
    );

  // Load cached coin list if it exists and is fresh - 1 day old
  useEffect(() => {
    const cached = loadFromLocalStorage("coinListCache", DAY_IN_MS);
    const isValidCoinCachedList = // Ensure all items from cache are valid
      Array.isArray(cached) &&
      cached.every((item) => item.id && item.name && item.image);

    if (isValidCoinCachedList) {
      setCachedCoinList(cached as Coin[]);
    } else if (isSuccessGetCoinList && coinListData) {
      saveToLocalStorage("coinListCache", coinListData);
      setCachedCoinList(coinListData);
    }
  }, [coinListData, isSuccessGetCoinList]);

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
        }))
      : [];
  }, [priceHistoryData]);

  const ConnectWallet = () => {
    const { isConnected } = useAccount();
    if (isConnected) return <Account />;
    return <WalletOptions />;
  };

  return (
    <div className="flex flex-col items-center h-screen p-5">
      <div className="inline-flex justify-end w-full p-5">
        <ConnectWallet />
      </div>
      <h1>Crypto Asset Tracker</h1>
      <p>Track your favourite crypto</p>
      <div className="flex flex-col w-4xl items-center gap-4 mt-4">
        <div className="w-sm p-5">
          {!!formattedCoinListData.length && (
            <CryptoSelect
              options={formattedCoinListData}
              onChangeHandler={(option: SelectOption) => {
                setSelectedCoin(option?.value || "");
              }}
            />
          )}
        </div>
        <div className="flex w-full p-5">
          {isSuccessGetPriceHistory && (
            <Chart
              data={formattedPriceHistoryData}
              daysRange={daysRange}
              setDaysRange={setDaysRange}
            />
          )}
        </div>
      </div>
      <footer className="mt-auto text-gray-500">
        <small>
          Powered by CoinGecko API & Crafted by Juan Manuel Lamperti
        </small>
      </footer>
    </div>
  );
}

export default App;
