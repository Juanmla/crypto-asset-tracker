import React from "react";
import App from "../src/App";
import {
  useGetCoinsListQuery,
  useGetPriceHistoryQuery,
} from "../src/services/coins";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../src/utils/localStorage";
import { vi, test, expect, describe, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Coin } from "../src/utils/types";

// Mock the modules with vi.mock
vi.mock("../src/services/coins");
vi.mock("../src/utils/localStorage");

// Create typed mocks using vi.mocked()
const mockedUseGetCoinsListQuery = vi.mocked(useGetCoinsListQuery);
const mockedUseGetPriceHistoryQuery = vi.mocked(useGetPriceHistoryQuery);
const mockedLoadFromLocalStorage = vi.mocked(loadFromLocalStorage);
const mockedSaveToLocalStorage = vi.mocked(saveToLocalStorage);

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

describe("App Component", () => {
  const mockCoinList: Coin[] = [
    {
      id: "dash",
      name: "Dash",
      image:
        "https://coin-images.coingecko.com/coins/images/19/large/dash-logo.png?1696501423",
      symbol: "dash",
    },
    {
      id: "1inch",
      name: "1inch",
      image:
        "https://coin-images.coingecko.com/coins/images/13469/large/1inch-token.png?1696513230",
      symbol: "1inch",
    },
  ];

  const mockPriceHistory = {
    prices: [
      [1672531200000, 1000],
      [1672617600000, 1100],
    ] as [number, number][],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // default mock implementations
    mockedUseGetCoinsListQuery.mockReturnValue({
      data: undefined,
      isSuccess: false,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });
  });

  test("saves fetched coin list to local storage if valid", async () => {
    mockedUseGetCoinsListQuery.mockReturnValue({
      data: mockCoinList,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockedUseGetPriceHistoryQuery.mockReturnValue({
      data: mockPriceHistory,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockedLoadFromLocalStorage.mockReturnValue(undefined); // simulates empty cache

    render(<App />);

    await waitFor(() => {
      expect(mockedSaveToLocalStorage).toHaveBeenCalledWith(
        "coinListCache",
        mockCoinList
      );
    });
  });

  test("renders correct initial UI elements when data is loaded", async () => {
    // Set up mock data
    mockedUseGetCoinsListQuery.mockReturnValue({
      data: mockCoinList,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    mockedUseGetPriceHistoryQuery.mockReturnValue({
      data: mockPriceHistory,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<App />);

    // Verify main heading and description
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Crypto Asset Tracker"
    );
    expect(
      screen.getByText("Track your favourite crypto stats")
    ).toBeInTheDocument();

    // Wait for and verify crypto select appears
    await waitFor(() => {
      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });
  });
});
