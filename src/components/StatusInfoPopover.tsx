import { useState } from 'react';
import { IonButton, IonIcon, IonPopover, IonContent } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import './StatusInfoPopover.css';

const StatusInfoPopover: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<Event | undefined>(undefined);

  const handleClick = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setOpen(true);
  };

  return (
    <>
      <IonButton fill="clear" size="small" className="status-info-btn" onClick={handleClick}>
        <IonIcon icon={informationCircleOutline} slot="icon-only" />
      </IonButton>

      <IonPopover
        isOpen={open}
        event={popoverEvent}
        onDidDismiss={() => setOpen(false)}
        side="top"
        alignment="end"
        className="status-info-popover"
      >
        <IonContent class="status-info-popover-content">
          <h4 className="status-info-heading">Keterangan Status</h4>
          <p><strong>OF</strong> — Offer, penawaran awal</p>
          <p><strong>FU1</strong> — Follow Up pertama</p>
          <p><strong>FU2</strong> — Follow Up kedua</p>
          <p><strong>C</strong> — Closing, deal berhasil</p>
          <p><strong>ND</strong> — No Deal, tidak lanjut</p>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default StatusInfoPopover;