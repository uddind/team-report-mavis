import { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from '@ionic/react';
import { listOutline, closeOutline, checkmarkCircle } from 'ionicons/icons';
import { statusMetaMap } from '../utils/statusMeta';
import type { StatusCode } from '../types/Report';
import './StatusInfoModal.css';

const orderedCodes: StatusCode[] = ['OF', 'FU1', 'FU2', 'C', 'ND'];

const StatusInfoModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IonButton fill="clear" size="small" className="status-info-trigger" onClick={() => setOpen(true)}>
        <IonIcon icon={listOutline} slot="start" />
        Lihat Semua Status
      </IonButton>

      <IonModal
        isOpen={open}
        onDidDismiss={() => setOpen(false)}
        breakpoints={[0, 0.6, 0.9]}
        initialBreakpoint={0.6}
        className="status-info-modal"
      >
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>📋 Keterangan Status</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setOpen(false)}>
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="status-info-modal-content">
          {orderedCodes.map((code) => {
            const meta = statusMetaMap[code];
            return (
              <div key={code} className="status-info-modal-card" style={{ background: meta.bgColor }}>
                <IonIcon icon={checkmarkCircle} style={{ color: meta.color }} className="status-info-modal-icon" />
                <div>
                  <p className="status-info-modal-code" style={{ color: meta.color }}>
                    {meta.code} — {meta.title}
                  </p>
                  <p className="status-info-modal-desc">{meta.description}</p>
                </div>
              </div>
            );
          })}
        </IonContent>
      </IonModal>
    </>
  );
};

export default StatusInfoModal;