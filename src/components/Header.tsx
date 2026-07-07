import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  useIonRouter,
} from '@ionic/react';
import { personOutline, notificationsOutline } from 'ionicons/icons';
import './Header.css';

interface HeaderProps {
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNotificationClick }) => {
  const router = useIonRouter();

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <IonHeader className="ion-no-border">
      <IonToolbar>
        <IonTitle slot="start" className="mavis-title">
          📋 MRS
        </IonTitle>

        <IonButtons slot="end">
          <IonButton onClick={handleProfileClick} fill="clear" className="avatar-button">
            <div className="avatar-circle">
              <IonIcon icon={personOutline} />
            </div>
          </IonButton>
          <IonButton onClick={onNotificationClick} fill="clear">
            <IonIcon icon={notificationsOutline} slot="icon-only" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;