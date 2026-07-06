import { useState } from 'react';
import { IonInput, IonButton, IonIcon, IonPopover, IonList, IonItem, IonLabel } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import './ComboPriceInput.css';

const presetPrices = [
  20000, 50000, 100000, 250000, 500000,
  1000000, 2500000, 5000000, 10000000,
  25000000, 50000000, 75000000, 100000000,
];

function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

interface ComboPriceInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ComboPriceInput: React.FC<ComboPriceInputProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<Event | undefined>(undefined);

  const openPresets = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setOpen(true);
  };

  const selectPreset = (n: number) => {
    onChange(formatRupiah(n));
    setOpen(false);
  };

  return (
    <div className="combo-price-wrapper">
      <IonInput
        value={value}
        onIonInput={(e) => onChange(e.detail.value ?? '')}
        placeholder="Rp 20.000 - Rp 100.000.000"
      />
      <IonButton fill="clear" size="small" className="combo-price-btn" onClick={openPresets}>
        <IonIcon icon={chevronDownOutline} slot="icon-only" />
      </IonButton>

      <IonPopover
        isOpen={open}
        event={popoverEvent}
        onDidDismiss={() => setOpen(false)}
        side="bottom"
        alignment="end"
      >
        <IonList>
          {presetPrices.map((n) => (
            <IonItem key={n} button onClick={() => selectPreset(n)}>
              <IonLabel>{formatRupiah(n)}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonPopover>
    </div>
  );
};

export default ComboPriceInput;