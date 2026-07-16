import React from 'react';
import type { Province } from '../../types/Regional';
import RegionalSelectField from './RegionalSelectField';

interface ProvinceSelectProps {
  data: Province[];
  value: string;
  onChange: (province: Province) => void;
  loading: boolean;
  disabled?: boolean;
}

const ProvinceSelect: React.FC<ProvinceSelectProps> = React.memo(({
  data,
  value,
  onChange,
  loading,
  disabled,
}) => {
  return (
    <RegionalSelectField<Province>
      label="Provinsi"
      placeholder="Pilih Provinsi"
      data={data}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
      required
    />
  );
});

ProvinceSelect.displayName = 'ProvinceSelect';

export default ProvinceSelect;