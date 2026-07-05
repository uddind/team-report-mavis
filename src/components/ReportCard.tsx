import { IonCard, IonCardContent, IonBadge, IonButton, IonIcon } from '@ionic/react';
import { documentTextOutline, createOutline, trashOutline } from 'ionicons/icons';
import type { Report } from '../types/Report';
import './ReportCard.css';

interface ReportCardProps {
  report: Report;
  onDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusColorMap: Record<string, string> = {
  OF: '#94A3B8',
  FU1: '#F59E0B',
  FU2: '#F97316',
  C: '#3B82F6',
  ND: '#EF4444',
};

const ReportCard: React.FC<ReportCardProps> = ({ report, onDetail, onEdit, onDelete }) => {
  const badgeColor = statusColorMap[report.statusCode] || '#94A3B8';

  return (
    <IonCard className="report-card">
      <IonCardContent>
        <div className="report-card-top">
          <h2 className="report-card-title">🏫 {report.schoolName}</h2>
          <IonBadge
            style={{
              '--background': badgeColor,
              '--color': '#ffffff',
            } as React.CSSProperties}
          >
            {report.statusCode} - {report.statusTemperature}
          </IonBadge>
        </div>

        <div className="report-card-body">
          <p>
            <span className="report-card-label">by Chat / Visit:</span> {report.byChatVisit}
          </p>
          <p>
            <span className="report-card-label">Product Offer:</span> {report.productOffer}
          </p>
          <p>
            <span className="report-card-label">Response:</span> {report.respon}
          </p>
          <p>
            <span className="report-card-label">Appointment:</span> {report.appointment.tanggal}{' '}
            {report.appointment.jam}
          </p>
        </div>

        <div className="report-card-actions">
          <IonButton
            size="small"
            fill="outline"
            expand="block"
            onClick={() => onDetail(report.id)}
          >
            <IonIcon icon={documentTextOutline} slot="start" />
            Detail
          </IonButton>
          <IonButton
            size="small"
            fill="solid"
            expand="block"
            onClick={() => onEdit(report.id)}
          >
            <IonIcon icon={createOutline} slot="start" />
            Edit
          </IonButton>
          {onDelete && (
            <IonButton
              size="small"
              fill="clear"
              color="danger"
              onClick={() => onDelete(report.id)}
            >
              <IonIcon icon={trashOutline} slot="icon-only" />
            </IonButton>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ReportCard;