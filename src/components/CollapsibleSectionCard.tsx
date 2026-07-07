import { IonCard, IonAccordionGroup, IonAccordion, IonItem, IonLabel } from '@ionic/react';
import './CollapsibleSectionCard.css';

interface CollapsibleSectionCardProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSectionCard: React.FC<CollapsibleSectionCardProps> = ({ title, children }) => {
  return (
    <IonCard className="form-section-card collapsible-section-card">
      <IonAccordionGroup>
        <IonAccordion value="section">
          <IonItem slot="header" lines="none" className="collapsible-header">
            <IonLabel className="collapsible-title-label">{title}</IonLabel>
          </IonItem>
          <div className="ion-padding form-section-body collapsible-content" slot="content">
            {children}
          </div>
        </IonAccordion>
      </IonAccordionGroup>
    </IonCard>
  );
};

export default CollapsibleSectionCard;