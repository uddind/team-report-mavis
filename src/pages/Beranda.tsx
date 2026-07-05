import { useState, useMemo } from 'react';
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react';
import Header from '../components/Header';
import ReportCard from '../components/ReportCard';
import type { Report, StatusCode } from '../types/Report';
import { getAllReports } from '../services/reportService';
import './Beranda.css';

type FilterValue = 'Semua' | StatusCode;

const statusFilters: FilterValue[] = ['Semua', 'OF', 'FU1', 'FU2', 'C', 'ND'];

const Beranda: React.FC = () => {
  const router = useIonRouter();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterValue>('Semua');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    const data = await getAllReports();
    setReports(data);
    setLoading(false);
  };

  // Reload every time this tab becomes active (e.g. after adding/editing a report)
  useIonViewWillEnter(() => {
    loadReports();
  });

  const summaryCounts = useMemo(() => {
    const counts: Record<StatusCode, number> = { OF: 0, FU1: 0, FU2: 0, C: 0, ND: 0 };
    reports.forEach((r) => {
      counts[r.statusCode]++;
    });
    return counts;
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesFilter = activeFilter === 'Semua' || r.statusCode === activeFilter;
      const matchesSearch = r.schoolName.toLowerCase().includes(searchText.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [reports, activeFilter, searchText]);

  const handleDetail = (id: string) => {
    router.push(`/detail-report/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/edit-report/${id}`);
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className="beranda-content">
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value ?? '')}
          placeholder="Cari nama sekolah..."
          className="beranda-searchbar"
        />

        <div className="summary-section">
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-value">{summaryCounts.OF}</span>
              <span className="summary-label">OF</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{summaryCounts.FU1}</span>
              <span className="summary-label">FU1</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{summaryCounts.FU2}</span>
              <span className="summary-label">FU2</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{summaryCounts.C}</span>
              <span className="summary-label">C</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{summaryCounts.ND}</span>
              <span className="summary-label">ND</span>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <IonSegment
            scrollable
            value={activeFilter}
            onIonChange={(e) => setActiveFilter(e.detail.value as FilterValue)}
          >
            {statusFilters.map((f) => (
              <IonSegmentButton key={f} value={f}>
                <IonLabel>{f}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </div>

        <div className="report-list-section">
          {loading ? (
            <div className="loading-state">
              <IonSpinner name="crescent" />
            </div>
          ) : filteredReports.length === 0 ? (
            <p className="empty-state">Tidak ada report ditemukan.</p>
          ) : (
            filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDetail={handleDetail}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Beranda;