export type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank?: number;
  market_cap?: number;
  total_volume?: number;
  total_supply?: number;
  current_price?: number;
};

export type CryptoSelectProps = {
  options: SelectOption[];
  defaultValue?: SelectOption;
  isLoading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeHandler: (option: any) => void;
};

export type SelectOption = {
  value: string;
  label: string;
  image: string;
};

export enum DaysRangeEnum {
  SEVEN_DAYS = 7,
  THIRTY_DAYS = 30,
  ONE_YEAR = 365,
}
