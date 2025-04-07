import type { Coin } from "../utils/types";

interface CryptoStatsBarProps {
  coin?: Coin;
  compareCoin?: Coin;
}

const formatNumber = (num?: number): string => {
  if (!num) return "N/A";
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
};

const formatSupply = (num?: number): string => {
  if (!num) return "N/A";
  return num.toLocaleString();
};

export const CryptoStatsBar = ({ coin, compareCoin }: CryptoStatsBarProps) => {
  if (!coin) return null;

  return (
    <div className="w-full mt-6 space-y-6">
      {/* primary coin stats */}
      <div className="flex flex-wrap gap-6 p-5 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-700">
        <StatItem label="Symbol" value={coin.symbol.toUpperCase()} />
        <StatItem label="Rank" value={`#${coin.market_cap_rank}`} />
        <StatItem label="Market Cap" value={formatNumber(coin.market_cap)} />
        <StatItem label="24h Volume" value={formatNumber(coin.total_volume)} />
        <StatItem
          label="Total Supply"
          value={formatSupply(coin.total_supply)}
        />
      </div>

      {/* comparison coin stats */}
      {compareCoin && (
        <div className="flex flex-wrap gap-6 p-5 rounded-xl bg-emerald-50 dark:bg-zinc-800/70 border-l-4 border-emerald-500 shadow-inner">
          <h3 className="w-full text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
            Comparison
          </h3>
          <StatItem
            label="Symbol"
            value={compareCoin.symbol.toUpperCase()}
            compareValue={coin.symbol.toUpperCase()}
          />
          <StatItem
            label="Rank"
            value={`#${compareCoin.market_cap_rank}`}
            compareValue={`#${coin.market_cap_rank}`}
          />
          <StatItem
            label="Market Cap"
            value={formatNumber(compareCoin.market_cap)}
            compareValue={formatNumber(coin.market_cap)}
          />
          <StatItem
            label="24h Volume"
            value={formatNumber(compareCoin.total_volume)}
            compareValue={formatNumber(coin.total_volume)}
          />
          <StatItem
            label="Total Supply"
            value={formatSupply(compareCoin.total_supply)}
            compareValue={formatSupply(coin.total_supply)}
          />
        </div>
      )}
    </div>
  );
};

function StatItem({
  label,
  value,
  compareValue,
}: {
  label: string;
  value: string;
  compareValue?: string;
}) {
  return (
    <div className="flex flex-col min-w-[140px]">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
          {value}
        </span>
        {compareValue && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            (vs {compareValue})
          </span>
        )}
      </div>
    </div>
  );
}
