import { IonIcon } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { getStatusMeta } from '../utils/statusMeta';
import type { StatusCode } from '../types/Report';
import './StatusPreviewCard.css';

interface StatusPreviewCardProps {
  statusCode: StatusCode;
}

const StatusPreviewCard: React.FC<StatusPreviewCardProps> = ({ statusCode }) => {
  const meta = getStatusMeta(statusCode);

  return (
    <div className="status-preview-card" style={{ background: meta.bgColor }}>
      <IonIcon icon={checkmarkCircle} style={{ color: meta.color }} className="status-preview-icon" />
      <div className="status-preview-text">
        <p className="status-preview-title" style={{ color: meta.color }}>{meta.title}</p>
        <p className="status-preview-desc">{meta.description}</p>
      </div>
    </div>
  );
};

export default StatusPreviewCard;