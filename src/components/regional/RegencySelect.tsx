import React from "react";
import type { Regency } from "../../types/Regional";
import RegionalSelectField from "./RegionalSelectField";
interface RegencySelectProps {
  data: Regency[];
  value: string;
  onChange: (regency: Regency) => void;
  loading: boolean;
  disabled?: boolean;
}

const RegencySelect: React.FC<RegencySelectProps> = React.memo(({
  data,
  value,
  onChange,
  loading,
  disabled,
}) => {
  return (
    <RegionalSelectField<Regency>
      label="Regency"
      placeholder="Regency"
      data={data}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
      required
    />
  );
});

RegencySelect.displayName = 'Kota/Kabupaten';

export default RegencySelect;