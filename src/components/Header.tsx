import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
} from '@ionic/react';
import { menuOutline, searchOutline, notificationsOutline } from 'ionicons/icons';

interface HeaderProps {
  onSearchClick?: () => void;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onMenuClick,
  onNotificationClick,
}) => {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={onMenuClick} fill="clear">
            <IonIcon icon={menuOutline} slot="icon-only" />
          </IonButton>
        </IonButtons>

        <IonTitle>📋 TeamReport Mavis</IonTitle>

        <IonButtons slot="end">
          <IonButton onClick={onSearchClick} fill="clear">
            <IonIcon icon={searchOutline} slot="icon-only" />
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