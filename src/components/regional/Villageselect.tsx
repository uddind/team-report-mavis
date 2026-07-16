import React from 'react';
import type { Village } from '../../types/Regional';
import RegionalSelectField from './RegionalSelectField';

interface VillageSelectProps {
  data: Village[];
  value: string;
  onChange: (village: Village) => void;
  loading: boolean;
  disabled?: boolean;
}

const VillageSelect: React.FC<VillageSelectProps> = React.memo(({
  data,
  value,
  onChange,
  loading,
  disabled,
}) => {
  return (
    <RegionalSelectField<Village>
      label="Kelurahan (Opsional)"
      placeholder="Pilih Kelurahan"
      data={data}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
    />
  );
});

VillageSelect.displayName = 'VillageSelect';

export default VillageSelect;