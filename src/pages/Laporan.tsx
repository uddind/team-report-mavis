import { useState, useMemo } from 'react';
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonAlert,
  IonSpinner,
  useIonRouter,
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import Header from '../components/Header';
import ReportCard from '../components/ReportCard';
import type { Report, StatusCode } from '../types/Report';
import { getAllReports, deleteReport } from '../services/reportService';
import './Laporan.css';

type FilterValue = 'Semua' | StatusCode;

const statusFilters: FilterValue[] = ['Semua', 'OF', 'FU1', 'FU2', 'C', 'ND'];

const Laporan: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterValue>('Semua');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    const data = await getAllReports();
    setReports(data);
    setLoading(false);
  };

  useIonViewWillEnter(() => {
    loadReports();
  });

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

  const handleDeleteRequest = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    await deleteReport(deleteTargetId);
    await loadReports();

    presentToast({
      message: 'Report berhasil dihapus',
      duration: 2000,
      color: 'success',
      position: 'top',
    });

    setDeleteTargetId(null);
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className="laporan-content">
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value ?? '')}
          placeholder="Cari nama sekolah..."
          className="laporan-searchbar"
        />

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
                onDelete={handleDeleteRequest}
              />
            ))
          )}
        </div>

        <IonAlert
          isOpen={deleteTargetId !== null}
          header="Hapus Report"
          message="Apakah kamu yakin ingin menghapus report ini? Tindakan ini tidak dapat dibatalkan."
          buttons={[
            {
              text: 'Batal',
              role: 'cancel',
              handler: () => setDeleteTargetId(null),
            },
            {
              text: 'Hapus',
              role: 'destructive',
              handler: confirmDelete,
            },
          ]}
          onDidDismiss={() => setDeleteTargetId(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Laporan;