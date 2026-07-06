import { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { helpCircleOutline } from 'ionicons/icons';
import './StatusInfoPopover.css';

const StatusInfoPopover: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IonButton fill="clear" size="small" className="status-info-button" onClick={() => setOpen(true)}>
        <IonIcon icon={helpCircleOutline} slot="icon-only" />
      </IonButton>

      <IonPopover isOpen={open} onDidDismiss={() => setOpen(false)} className="status-info-popover">
        <IonContent class="status-info-popover-content">
          <h3 className="status-info-title">Keterangan Status</h3>
          <IonList lines="none">
            <IonItem>
              <IonLabel className="ion-text-wrap"><strong>OF</strong> — Offer (penawaran awal)</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="ion-text-wrap"><strong>FU1</strong> — Follow Up 1</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="ion-text-wrap"><strong>FU2</strong> — Follow Up 2</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="ion-text-wrap"><strong>C</strong> — Closing (deal berhasil)</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="ion-text-wrap"><strong>ND</strong> — No Deal / tidak ada respon</IonLabel>
            </IonItem>
          </IonList>

          <h3 className="status-info-title">Keterangan Temperatur</h3>
          <IonList lines="none">
            <IonItem>
              <IonLabel className="ion-text-wrap"><strong>Cold</strong> — Belum tertarik</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="ion-text-wrap"><strong>Warm</strong> — Mulai tertarik, perlu tindak lanjut</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="ion-text-wrap"><strong>Hot</strong> — Sangat tertarik, siap closing</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default StatusInfoPopover;