import React from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption, IonSpinner, IonText } from '@ionic/react';

/**
 * Semua entitas wilayah (Province, Regency, District, Village) punya
 * bentuk yang sama: { code, name }. Interface ini dipakai sebagai
 * constraint generic, bukan sebagai pengganti tipe asli di Regional.ts.
 */
interface RegionalOption {
  code: string;
  name: string;
}

interface RegionalSelectFieldProps<T extends RegionalOption> {
  label: string;
  placeholder: string;
  data: T[];
  value: string;
  onChange: (item: T) => void;
  loading: boolean;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Komponen dasar (internal, tidak dipakai langsung oleh halaman).
 * Dipakai oleh ProvinceSelect / RegencySelect / DistrictSelect / VillageSelect.
 */
function RegionalSelectField<T extends RegionalOption>({
  label,
  placeholder,
  data,
  value,
  onChange,
  loading,
  disabled = false,
  required = false,
}: RegionalSelectFieldProps<T>): React.ReactElement {
  const isDisabled = disabled || loading;

  const handleChange = (selectedCode: string): void => {
    const found = data.find((item) => item.code === selectedCode);
    if (found) {
      onChange(found);
    }
  };

  return (
    <IonItem lines="full">
      <IonLabel position="stacked" style={{ fontWeight: 600, marginBottom: 4 }}>
        {label}
        {required && (
          <IonText color="danger" style={{ marginLeft: 4 }}>
            *
          </IonText>
        )}
        {loading && (
          <IonSpinner
            name="crescent"
            style={{ marginLeft: 8, width: 14, height: 14, verticalAlign: 'middle' }}
          />
        )}
      </IonLabel>
      <IonSelect
        placeholder={loading ? 'Memuat...' : placeholder}
        value={value || undefined}
        disabled={isDisabled}
        onIonChange={(e) => handleChange(e.detail.value as string)}
      >
        {data.map((item) => (
          <IonSelectOption key={item.code} value={item.code}>
            {item.name}
          </IonSelectOption>
        ))}
      </IonSelect>
    </IonItem>
  );
}

export default RegionalSelectField;