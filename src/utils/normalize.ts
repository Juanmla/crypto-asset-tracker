type NormalizedDataPoint = {
  date: string;
  [coinId: string]: number | string; // Dynamic keys for each coin's price
};

export function normalizeData(
  data: { date: string; price: number; coinId?: string }[]
): NormalizedDataPoint[] {
  const groupedByDate: Record<string, NormalizedDataPoint> = {};

  data.forEach((item) => {
    const { date, price, coinId = "main" } = item;

    if (!groupedByDate[date]) {
      groupedByDate[date] = { date };
    }

    groupedByDate[date][coinId] = price;
  });

  return Object.values(groupedByDate);
}
