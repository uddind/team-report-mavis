import { useState, useMemo } from 'react';
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonIcon,
  IonButton,
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react';
import { optionsOutline, documentTextOutline, addOutline } from 'ionicons/icons';
import Header from '../components/Header';
import ReportCard from '../components/ReportCard';
import type { Report, StatusCode } from '../types/Report';
import { getAllReports } from '../services/reportService';
import { statusMetaMap } from '../utils/statusMeta';
import './Beranda.css';

type FilterValue = 'Semua' | StatusCode;

const statusFilters: FilterValue[] = ['Semua', 'OF', 'FU1', 'FU2', 'C', 'ND'];
const dashboardCodes: StatusCode[] = ['OF', 'FU1', 'FU2', 'C', 'ND'];

const Beranda: React.FC = () => {
  const router = useIonRouter();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterValue>('Semua');
  const [showFilter, setShowFilter] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    const data = await getAllReports();
    setReports(data);
    setLoading(false);
  };

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

  const handleTambahReport = () => {
    router.push('/tambah-report');
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className="beranda-content">
        <div className="search-row">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value ?? '')}
            placeholder="Cari nama sekolah..."
            className="beranda-searchbar"
          />
          <button
            className={`filter-btn ${showFilter ? 'filter-btn-active' : ''}`}
            onClick={() => setShowFilter((v) => !v)}
          >
            <IonIcon icon={optionsOutline} />
          </button>
        </div>

        {showFilter && (
          <div className="filter-section fade-in">
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
        )}

        <div className="summary-section">
          <div className="summary-grid">
            {dashboardCodes.map((code) => {
              const meta = statusMetaMap[code];
              return (
                <div
                  key={code}
                  className="summary-card hover-scale"
                  style={{ background: meta.bgColor }}
                >
                  <span className="summary-value" style={{ color: meta.color }}>
                    {summaryCounts[code]}
                  </span>
                  <span className="summary-label" style={{ color: meta.color }}>
                    {code}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="report-list-section">
          {loading ? (
            <div className="loading-state">
              <IonSpinner name="crescent" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="empty-state fade-in">
              <IonIcon icon={documentTextOutline} className="empty-state-icon" />
              <h3 className="empty-state-title">Belum ada report ditemukan</h3>
              <p className="empty-state-desc">
                Buat report pertama Anda dengan menekan tombol tambah.
              </p>
              <IonButton className="empty-state-btn" onClick={handleTambahReport}>
                <IonIcon icon={addOutline} slot="start" />
                Tambah Report
              </IonButton>
            </div>
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