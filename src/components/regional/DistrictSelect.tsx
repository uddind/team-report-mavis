import React from 'react';
import type { District } from '../../types/Regional';
import RegionalSelectField from './RegionalSelectField';

interface DistrictSelectProps {
  data: District[];
  value: string;
  onChange: (district: District) => void;
  loading: boolean;
  disabled?: boolean;
}

const DistrictSelect: React.FC<DistrictSelectProps> = React.memo(({
  data,
  value,
  onChange,
  loading,
  disabled,
}) => {
  return (
    <RegionalSelectField<District>
      label="Kecamatan (Opsional)"
      placeholder="Pilih Kecamatan"
      data={data}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
    />
  );
});

DistrictSelect.displayName = 'DistrictSelect';

export default DistrictSelect;