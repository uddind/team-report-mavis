import { IonCard, IonCardContent } from '@ionic/react';
import './FormSectionCard.css';

interface FormSectionCardProps {
  title: string;
  children: React.ReactNode;
}

const FormSectionCard: React.FC<FormSectionCardProps> = ({ title, children }) => {
  return (
    <IonCard className="form-section-card">
      <IonCardContent>
        <h2 className="form-section-title">{title}</h2>
        <div className="form-section-body">{children}</div>
      </IonCardContent>
    </IonCard>
  );
};

export default FormSectionCard;