import React from 'react';
import type { Province } from '../../types/Regional';
import SearchableRegionSelect from '../SearchableRegionSelect'; //  Sudah diperbaiki ke file .tsx asli

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
  // Menjembatani onChange: SearchableRegionSelect mengirim string (code),
  // sedangkan komponen ini ingin mengembalikan objek Province utuh ke luar.
  const handleOnChange = (code: string) => {
    const selectedProvince = data.find((p) => p.code === code); 
    if (selectedProvince) {
      onChange(selectedProvince);
    }
  };

  return (
    <SearchableRegionSelect
      label="Provinsi"
      placeholder="Pilih Provinsi"
      data={data}
      value={value}
      onChange={handleOnChange}
      loading={loading}
      disabled={disabled}
    />
  );
});

ProvinceSelect.displayName = 'ProvinceSelect';

export default ProvinceSelect;