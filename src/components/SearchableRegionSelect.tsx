import { useState, useMemo } from 'react';
import {
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonSearchbar,
  IonContent,
  IonList,
  IonSpinner,
} from '@ionic/react';
import { chevronDownOutline, closeOutline } from 'ionicons/icons';
//import './SearchableRegionSelect.css';

interface RegionOption {
  code: string;
  name: string;
}

interface SearchableRegionSelectProps {
  label: string;
  placeholder?: string;
  data: RegionOption[];
  value: string;
  onChange: (code: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

const SearchableRegionSelect: React.FC<SearchableRegionSelectProps> = ({
  label,
  placeholder = 'Pilih...',
  data,
  value,
  onChange,
  loading = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedName = data.find((d) => d.code === value)?.name ?? '';

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    const lower = searchText.toLowerCase();
    return data.filter((d) => d.name.toLowerCase().includes(lower));
  }, [data, searchText]);

  const handleOpen = () => {
    if (disabled || loading) return;
    setSearchText('');
    setIsOpen(true);
  };

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <>
      <IonItem lines="full" button={!disabled} detail={false} onClick={handleOpen} className="region-select-item">
        <IonLabel position="stacked" className="region-select-label">
          {label}
        </IonLabel>
        <div className="region-select-value-row">
          <span className={`region-select-value ${!selectedName ? 'placeholder' : ''}`}>
            {loading ? 'Memuat...' : selectedName || placeholder}
          </span>
          {loading ? (
            <IonSpinner name="crescent" className="region-select-spinner" />
          ) : (
            <IonIcon icon={chevronDownOutline} className="region-select-chevron" />
          )}
        </div>
      </IonItem>

      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} className="region-select-modal">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>{label}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value ?? '')}
              placeholder={`Cari ${label.toLowerCase()}...`}
              debounce={150}
            />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {filteredData.length === 0 ? (
            <p className="region-select-empty">Tidak ditemukan.</p>
          ) : (
            <IonList>
              {filteredData.map((item) => (
                <IonItem
                  key={item.code}
                  button
                  detail={false}
                  onClick={() => handleSelect(item.code)}
                  className={item.code === value ? 'region-select-active' : ''}
                >
                  <IonLabel>{item.name}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default SearchableRegionSelect;