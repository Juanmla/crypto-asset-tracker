import Select, { type StylesConfig } from "react-select";
import { type CryptoSelectProps, type SelectOption } from "../utils/types";

export const CryptoSelect = ({
  options,
  defaultValue,
  onChangeHandler,
}: CryptoSelectProps) => {
  const customStyles: StylesConfig<SelectOption, true> = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderRadius: "0.5rem",
      backgroundColor: "#242424",
      border: state.isFocused
        ? "1px solid #7d41eb"
        : state.isDisabled
        ? "1px solid #c45b5b"
        : "1px solid #fff",
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: "#fff",
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: "#fff",
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      color: "#111",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }),
  };

  // Custom option label to include image (included in API res) and text
  const formatOptionLabel = (option: SelectOption) => (
    <div className="flex items-center gap-2">
      <img
        src={option.image}
        alt={option.label}
        className="w-5 h-5 rounded-full object-contain"
      />
      <span>{option.label}</span>
    </div>
  );

  return (
    <Select
      styles={customStyles}
      options={options}
      defaultValue={defaultValue}
      name="CryptoSelect"
      isSearchable
      formatOptionLabel={formatOptionLabel}
      onChange={onChangeHandler}
    />
  );
};
