export type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
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
