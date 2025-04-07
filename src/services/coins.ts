import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Coin } from "../utils/types";

export const coinsApi = createApi({
  reducerPath: "coinsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_COINGECKO_COINS_LIST_URL,
  }),
  endpoints: (builder) => ({
    getCoinsList: builder.query<Coin[], void>({
      query: () => "/markets?vs_currency=usd&order=market_cap_desc",
      keepUnusedDataFor: 86400, // 24 hours
    }),
    getPriceHistory: builder.query<
      { prices: [number, number][] },
      { coinId: string; days: number | string }
    >({
      query: ({ coinId, days }) =>
        `/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    }),
  }),
});

export const { useGetCoinsListQuery, useGetPriceHistoryQuery } = coinsApi;
