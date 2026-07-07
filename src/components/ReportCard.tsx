import { IonIcon, IonButton } from '@ionic/react';
import { chevronForwardOutline, chatbubbleOutline, walkOutline, createOutline, trashOutline } from 'ionicons/icons';
import type { Report } from '../types/Report';
import { statusMetaMap } from '../utils/statusMeta';
import './ReportCard.css';

interface ReportCardProps {
  report: Report;
  onDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDetail, onEdit, onDelete }) => {
  const meta = statusMetaMap[report.statusCode];
  const isChat = report.byChatVisit.toLowerCase().includes('chat');

  return (
    <div className="report-card hover-scale" onClick={() => onDetail(report.id)}>
      <div className="report-card-top">
        <span className="report-badge" style={{ background: meta.bgColor, color: meta.color }}>
          {meta.emoji} {report.statusCode}
        </span>
        <IonIcon icon={chevronForwardOutline} className="report-card-arrow" />
      </div>

      <h3 className="report-card-school">🏫 {report.schoolName}</h3>

      <div className="report-card-meta">
        <span className="report-card-method">
          <IonIcon icon={isChat ? chatbubbleOutline : walkOutline} />
          {report.byChatVisit || '-'}
        </span>
        <span className="report-card-time">{report.appointment.tanggal || '-'}</span>
      </div>

      <div className="report-card-actions" onClick={(e) => e.stopPropagation()}>
        <IonButton size="small" fill="clear" onClick={() => onEdit(report.id)}>
          <IonIcon icon={createOutline} slot="icon-only" />
        </IonButton>
        {onDelete && (
          <IonButton size="small" fill="clear" color="danger" onClick={() => onDelete(report.id)}>
            <IonIcon icon={trashOutline} slot="icon-only" />
          </IonButton>
        )}
      </div>
    </div>
  );
};

export default ReportCard;