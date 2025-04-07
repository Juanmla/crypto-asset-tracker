import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DaysRangeEnum } from "../utils/types";

type PriceData = {
  date: string;
  [coinId: string]: number | string; // dynamic keys for coin prices
};

type ChartProps = {
  data: PriceData[];
  setDaysRange: (days: number) => void;
  daysRange: number;
  showComparison?: boolean;
  selectedCoin: string;
  compareCoin: string;
};

type TooltipPayload = {
  value: number;
  name: string;
  payload: PriceData;
  color: string;
  dataKey: string;
}[];

// Custom tooltip that shows both prices when comparing
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 text-white rounded-sm p-2">
        <p className="text-xs m-0">{`Date: ${label}`}</p>
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="text-sm font-bold m-0"
            style={{ color: entry.color }}
          >
            {`${entry.name}: $${entry.value.toFixed(4)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Chart = ({
  data,
  setDaysRange,
  daysRange,
  showComparison,
  selectedCoin,
  compareCoin,
}: ChartProps) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Button group to define range date for price history data
  const RangeDatePicker = () => {
    const baseButtonClass =
      "px-3 py-1 text-sm font-medium border focus:z-10 focus:ring-2 focus:ring-gray-500 dark:focus:ring-white";
    const inactiveClass =
      "text-gray-900 bg-transparent border-gray-900 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700";
    const activeClass =
      "bg-gray-900 text-white dark:bg-gray-700 dark:text-white";

    return (
      <div className="inline-flex rounded-md shadow-xs" role="group">
        <button
          type="button"
          className={`${baseButtonClass} border-r-0 rounded-s-lg ${
            daysRange === DaysRangeEnum.SEVEN_DAYS ? activeClass : inactiveClass
          }`}
          onClick={() => setDaysRange(DaysRangeEnum.SEVEN_DAYS)}
        >
          7d
        </button>
        <button
          type="button"
          className={`${baseButtonClass} border-x-0 ${
            daysRange === DaysRangeEnum.THIRTY_DAYS
              ? activeClass
              : inactiveClass
          }`}
          onClick={() => setDaysRange(DaysRangeEnum.THIRTY_DAYS)}
        >
          30d
        </button>
        <button
          type="button"
          className={`${baseButtonClass} border-l-0 rounded-e-lg ${
            daysRange === DaysRangeEnum.ONE_YEAR ? activeClass : inactiveClass
          }`}
          onClick={() => setDaysRange(DaysRangeEnum.ONE_YEAR)}
        >
          1y
        </button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <RangeDatePicker />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            width={100}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey={selectedCoin}
            stroke="#8884d8"
            dot={false}
            name={selectedCoin.toUpperCase()}
          />
          {showComparison && compareCoin && (
            <Line
              type="monotone"
              dataKey={compareCoin}
              stroke="#82ca9d"
              dot={false}
              name={compareCoin.toUpperCase()}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
