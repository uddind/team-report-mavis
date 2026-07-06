import { useState } from 'react';
import { IonPopover, IonContent } from '@ionic/react';
import './StatusLegend.css';

const descriptions: Record<string, string> = {
  OF: 'Offer — penawaran awal ke sekolah',
  'FU1': 'Follow Up 1 — tindak lanjut pertama',
  'FU2': 'Follow Up 2 — tindak lanjut kedua',
  C: 'Closing — deal/kesepakatan berhasil',
  ND: 'No Deal — tidak ada respon / tidak lanjut',
  Cold: 'Belum tertarik dengan penawaran',
  Warm: 'Mulai tertarik, perlu tindak lanjut',
  Hot: 'Sangat tertarik, siap closing',
};

const statusTerms = ['OF', 'FU1', 'FU2', 'C', 'ND'];
const tempTerms = ['Cold', 'Warm', 'Hot'];

const StatusLegend: React.FC = () => {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [popoverEvent, setPopoverEvent] = useState<Event | undefined>(undefined);

  const handleTermClick = (term: string, e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setActiveTerm(term);
  };

  const renderTerm = (term: string, isLast: boolean) => (
    <span key={term}>
      <span className="legend-term" onClick={(e) => handleTermClick(term, e)}>
        {term}
      </span>
      {!isLast && <span className="legend-separator">/</span>}
    </span>
  );

  return (
    <div className="status-legend">
      <span className="legend-label">Status : </span>
      {statusTerms.map((term, i) => renderTerm(term, i === statusTerms.length - 1))}
      <span className="legend-separator legend-dash"> - </span>
      {tempTerms.map((term, i) => renderTerm(term, i === tempTerms.length - 1))}

      <IonPopover
        isOpen={activeTerm !== null}
        event={popoverEvent}
        onDidDismiss={() => setActiveTerm(null)}
        className="status-legend-popover"
      >
        <IonContent class="status-legend-popover-content">
          {activeTerm && (
            <>
              <h4 className="legend-popover-title">{activeTerm}</h4>
              <p className="legend-popover-desc">{descriptions[activeTerm]}</p>
            </>
          )}
        </IonContent>
      </IonPopover>
    </div>
  );
};

export default StatusLegend;