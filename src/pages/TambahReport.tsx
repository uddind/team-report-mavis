// src/pages/TambahReport.tsx
import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, 
  IonButton, IonGrid, IonText, IonRow, IonCol, useIonToast, IonSpinner,
  IonButtons, IonIcon, IonModal
} from '@ionic/react';
import { 
  notificationsOutline, personOutline, addOutline, closeOutline, 
  checkmarkCircleOutline 
} from 'ionicons/icons';
import SchoolAutocomplete from '../components/SchoolAutocomplete';
import { geocodeAddress } from '../utils/geocode';
import { supabase } from '../services/supabaseClient';

// ================= INTEGRASI LEAFLET MAPS INTERAKTIF =================
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix aset gambar marker Leaflet di Webpack/Vite bundler
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapLocation {
  lat: number;
  lng: number;
}

// 1. Komponen untuk Mengarahkan Kamera & Memaksa Peta Menggambar Ulang Elemen DOM-nya
const ChangeMapCenter = ({ center, modalOpen }: { center: MapLocation; modalOpen: boolean }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng && modalOpen) {
      // Mengatasi bug peta blank/abu-abu karena modal rendering
      setTimeout(() => {
        map.invalidateSize();
        const ChangeMapCenter = ({ center, modalOpen, zoom }: { center: MapLocation; modalOpen: boolean; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng && modalOpen) {
      setTimeout(() => {
        map.invalidateSize();
        map.setView([center.lat, center.lng], zoom);
      }, 350);
    }
  }, [center, map, modalOpen, zoom]);
  
  return null;
};
      }, 350); // Jeda aman menunggu transisi sliding modal Ionic selesai
    }
  }, [center, map, modalOpen]);
  
  return null;
};

// 2. Komponen Pembantu untuk Menggeser / Memindahkan PIN via Klik Layar Peta
const LocationMarker = ({ position, setPosition }: { position: MapLocation, setPosition: (loc: MapLocation) => void }) => {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

interface FormData {
  schoolName: string;
  interactionType: string;
  productOffer: string;
  responSekolah: string;
  statusProspek: string;
}

const TambahReport: React.FC = () => {
  const [presentToast] = useIonToast();
  
  // State Utama Form Report
  const [formData, setFormData] = useState<FormData>({
    schoolName: '',
    interactionType: '',
    productOffer: '',
    responSekolah: '',
    statusProspek: '',
  });

  // State Modal Alur Tambah Sekolah
  const [showAddSchoolModal, setShowAddSchoolModal] = useState<boolean>(false);
  const [isSavingSchool, setIsSavingSchool] = useState<boolean>(false);
  const [isSchoolSavedSuccess, setIsSchoolSavedSuccess] = useState<boolean>(false);
  
  // State Input Form Internal Sekolah Baru
  const [newSchoolName, setNewSchoolName] = useState<string>('');
  const [newSchoolCity, setNewSchoolCity] = useState<string>('');
  const [newSchoolKecamatan, setNewSchoolKecamatan] = useState<string>('');
  const [isSearchingMap, setIsSearchingMap] = useState<boolean>(false);
  
  // State Koordinat Lokasi Otomatis (Leaflet)
  const defaultMapCenter: MapLocation = { lat: -8.0983, lng: 112.1616 }; // Blitar, titik tengah default
const [mapLocation, setMapLocation] = useState<MapLocation>(defaultMapCenter);
const [hasFoundLocation, setHasFoundLocation] = useState<boolean>(false);

  const handleInputChange = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ================= OTOMATISASI PENCARIAN MAPS SAAT MENGETIK NAMA SEKOLAH =================
  useEffect(() => {
    if (!showAddSchoolModal) return;

    const delayDebounce = setTimeout(() => {
      if (newSchoolName.trim().length >= 4) {
        executeGeocode();
      }
    }, 1200); // Debounce 1.2 detik agar API tidak terbebani setiap ketikan huruf

    return () => clearTimeout(delayDebounce);
  }, [newSchoolName, newSchoolCity, newSchoolKecamatan, showAddSchoolModal]);

 const executeGeocode = async () => {
    setIsSearchingMap(true);

    const queryParts = [
      newSchoolName.trim(),
      newSchoolKecamatan.trim(),
      newSchoolCity.trim()
    ].filter(Boolean);

    const searchQuery = queryParts.join(', ');

    try {
      const geoResult = await geocodeAddress(searchQuery);
      if (geoResult && geoResult.lat && geoResult.lng) {
        setMapLocation({ lat: geoResult.lat, lng: geoResult.lng });
        setHasFoundLocation(true);
        return;
      }

      // Fallback 1: coba cari dengan nama sekolah + kota saja
      const fallback1 = await geocodeAddress(`${newSchoolName.trim()}, ${newSchoolCity.trim()}`);
      if (fallback1 && fallback1.lat && fallback1.lng) {
        setMapLocation({ lat: fallback1.lat, lng: fallback1.lng });
        setHasFoundLocation(true);
        return;
      }

      // Fallback 2: coba cari dengan nama sekolah saja
      const fallback2 = await geocodeAddress(newSchoolName.trim());
      if (fallback2 && fallback2.lat && fallback2.lng) {
        setMapLocation({ lat: fallback2.lat, lng: fallback2.lng });
        setHasFoundLocation(true);
        return;
      }

      // Fallback 3: kalau kota diisi, minimal peta pindah ke area kota tersebut
      // (bukan titik pasti sekolah — cuma supaya user tidak perlu geser peta manual dari lokasi jauh)
      if (newSchoolCity.trim()) {
        const cityResult = await geocodeAddress(newSchoolCity.trim());
        if (cityResult && cityResult.lat && cityResult.lng) {
          setMapLocation({ lat: cityResult.lat, lng: cityResult.lng });
          setHasFoundLocation(false);
          presentToast({
            message: `Sekolah "${newSchoolName.trim()}" tidak ditemukan di peta. Silakan ketuk peta untuk menandai lokasi tepatnya.`,
            duration: 3500,
            color: 'warning',
            position: 'top',
          });
        }
      }
    } catch (err) {
      console.error("Gagal melacak lokasi otomatis", err);
    } finally {
      setIsSearchingMap(false);
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'OF': return '💡 Offer Made: Penawaran awal telah resmi dikirimkan ke pihak sekolah.';
      case 'FU 1': return '📞 Follow Up 1: Kontak pertama setelah penawaran.';
      case 'C': return '🎉 Closing: Prospek berhasil sepakat.';
      default: return 'ℹ️ Silakan pilih opsi di atas untuk melihat detail deskripsi status.';
    }
  };

  // ================= AKSI UTAMA SIMPAN DATA KE SUPABASE =================
  const handleSaveNewSchool = async () => {
    if (!newSchoolName.trim() || !newSchoolCity.trim() || !newSchoolKecamatan.trim()) {
      presentToast({ message: 'Kolom Nama, Kota, dan Kecamatan wajib diisi!', duration: 2000, color: 'danger', position: 'top' });
      return;
    }

    setIsSavingSchool(true);
    
    // Ambil nilai koordinat lat & lng dari state peta saat ini
    const lat = mapLocation?.lat ?? null;
    const lng = mapLocation?.lng ?? null;

    try {
      const { error } = await supabase
        .from('sekolah') 
        .insert([
          { 
            nama_sekolah: newSchoolName.trim(), 
            kab_kota: newSchoolCity.trim(), 
            kecamatan: newSchoolKecamatan.trim(),
            latitude: lat,
            longtitude: lng, // Sesuaikan nama kolom di database Anda (longtitude / longitude)
            created_at: new Date().toISOString(),
            created_by: 'User App'
          }
        ]);

      if (error) throw error;

      setIsSchoolSavedSuccess(true);
      // Masukkan otomatis ke input form kunjungan utama
      setFormData(prev => ({ ...prev, schoolName: newSchoolName.trim() }));
      
    } catch (err: any) {
      presentToast({ message: 'Gagal menyimpan ke database: ' + err.message, duration: 3000, color: 'danger', position: 'top' });
    } finally {
      setIsSavingSchool(false);
    }
  };

const handleResetSchoolModal = () => {
    setShowAddSchoolModal(false);
    setTimeout(() => {
      setNewSchoolName('');
      setNewSchoolCity('');
      setNewSchoolKecamatan('');
      setIsSchoolSavedSuccess(false);
      setMapLocation(defaultMapCenter);
      setHasFoundLocation(false);
    }, 300);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#ffffff', '--padding-start': '16px', '--padding-end': '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            <IonTitle style={{ padding: 0, fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>MRS</IonTitle>
          </div>
          <IonButtons slot="end">
            <IonButton style={{ '--background': '#2563eb', '--border-radius': '50%', width: '40px', height: '40px' }}>
              <IonIcon icon={personOutline} style={{ color: '#ffffff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
        <IonGrid fixed>
          <IonCard style={{ margin: '0 0 16px 0', borderRadius: '12px' }}>
            <IonCardHeader color="light">
              <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>Form Kunjungan Utama</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="ion-no-padding">
              <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', paddingRight: '16px' }}>
                <div style={{ flex: 1 }}>
                  <IonItem lines="full">
                    <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '8px' }}>NAMA SEKOLAH *</IonLabel>
                    <SchoolAutocomplete value={formData.schoolName} onChange={(val: string) => handleInputChange('schoolName', val)} />
                  </IonItem>
                </div>
                <IonButton color="primary" onClick={() => setShowAddSchoolModal(true)} style={{ margin: '0 0 8px 8px', height: '38px' }}>
                  <IonIcon icon={addOutline} />
                </IonButton>
              </div>

              <IonItem lines="full">
                <IonLabel position="stacked">Metode Interaksi</IonLabel>
                <IonSelect placeholder="Pilih Chat / Visit" value={formData.interactionType} onIonChange={e => handleInputChange('interactionType', e.detail.value)}>
                  <IonSelectOption value="Chat">Chat</IonSelectOption>
                  <IonSelectOption value="Visit">Visit</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem lines="full">
                <IonLabel position="stacked">Product Offer</IonLabel>
                <IonInput placeholder="Masukkan penawaran produk..." value={formData.productOffer} onIonInput={e => handleInputChange('productOffer', e.detail.value)} />
              </IonItem>

              <IonItem lines="full">
                <IonLabel position="stacked">Respon</IonLabel>
                <IonTextarea placeholder="Respon sekolah..." value={formData.responSekolah} onIonInput={e => handleInputChange('responSekolah', e.detail.value)} />
              </IonItem>

              <IonItem lines="none">
                <IonLabel position="stacked">Status Prospek</IonLabel>
                <IonSelect placeholder="Pilih Status" value={formData.statusProspek} onIonChange={e => handleInputChange('statusProspek', e.detail.value)}>
                  <IonSelectOption value="OF">OF</IonSelectOption>
                  <IonSelectOption value="FU 1">FU 1</IonSelectOption>
                  <IonSelectOption value="C">C</IonSelectOption>
                </IonSelect>
              </IonItem>

              <div style={{ margin: '16px', padding: '10px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '13px', color: '#4b5563' }}>{getStatusDescription(formData.statusProspek)}</span>
              </div>
            </IonCardContent>
          </IonCard>

          <IonButton expand="block" shape="round" color="primary" onClick={() => alert('Report Kunjungan Disimpan')}>
            Simpan Report Kunjungan
          </IonButton>
        </IonGrid>
      </IonContent>

      {/* ================= MODAL TAMBAH SEKOLAH BARU ================= */}
      <IonModal isOpen={showAddSchoolModal} onDidDismiss={handleResetSchoolModal} style={{ '--height': '95%', '--border-radius': '16px' }}>
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--background': '#ffffff', 'padding': '8px 8px 0 8px' }}>
            <IonTitle style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {!isSchoolSavedSuccess ? 'Tambah Sekolah Baru' : 'Sekolah Berhasil Ditambahkan'}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleResetSchoolModal}>
                <IonIcon icon={closeOutline} style={{ fontSize: '24px' }} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {!isSchoolSavedSuccess ? (
          <IonContent className="ion-padding" style={{ '--background': '#ffffff' }}>
            <div>
              <IonItem lines="full" style={{ '--padding-start': '0px' }}>
                <IonLabel position="stacked" style={{ fontWeight: '600' }}>Nama Sekolah <IonText color="danger">*</IonText></IonLabel>
                <IonInput placeholder="Contoh: SMPN 1 Blitar" value={newSchoolName} onIonInput={e => setNewSchoolName(e.detail.value ?? '')} />
              </IonItem>
</div>
              <IonItem lines="full" style={{ '--padding-start': '0px', 'marginTop': '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: '600' }}>Kota / Kabupaten <IonText color="danger">*</IonText></IonLabel>
                <IonInput placeholder="Masukkan kota" value={newSchoolCity} onIonInput={e => setNewSchoolCity(e.detail.value ?? '')} />
              </IonItem>

              <IonItem lines="full" style={{ '--padding-start': '0px', 'marginTop': '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: '600' }}>Kecamatan <IonText color="danger">*</IonText></IonLabel>
                <IonInput placeholder="Masukkan kecamatan" value={newSchoolKecamatan} onIonInput={e => setNewSchoolKecamatan(e.detail.value ?? '')} />
              </IonItem>

              {/* PANEL PETA OTOMATIS */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: '600' }}>🗺️ Peta Lokasi Otomatis</span>
                  {isSearchingMap && <IonSpinner name="crescent" style={{ transform: 'scale(0.6)' }} />}
                </div>
                
                <div style={{ width: '100%', height: '230px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', zIndex: 1, position: 'relative' }}>
                  <MapContainer center={[mapLocation.lat, mapLocation.lng]} zoom={hasFoundLocation ? 17 : 13} style={{ width: '100', height: '100' }}>
                    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <ChangeMapCenter center={mapLocation} modalOpen={showAddSchoolModal} zoom={hasFoundLocation ? 17 : 13} />
                      <LocationMarker
                      position={mapLocation}
                      setPosition={(loc) => {
                        setMapLocation(loc);
                        setHasFoundLocation(true);
                      }}
                    />
                  </MapContainer>

                  {isSearchingMap && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: '#ffffff', borderRadius: '8px', padding: '4px 8px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                      <IonSpinner name="crescent" style={{ transform: 'scale(0.7)' }} />
                    </div>
                  )}

                  {!hasFoundLocation && !isSearchingMap && (
                    <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(255,255,255,0.92)', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', color: '#64748B', textAlign: 'center' }}>
                      Lokasi belum pasti — ketuk peta untuk menandai titik sekolah secara manual
                    </div>
                  )}
                </div>
              <IonButton 
                expand="block" 
                color="success" 
                onClick={handleSaveNewSchool} 
                disabled={isSavingSchool} 
                style={{ marginTop: '24px', height: '46px', fontWeight: 'bold' }}
              >
              
                {isSavingSchool ? <IonSpinner name="crescent" /> : 'Simpan Sekolah'}
              </IonButton>
            </div>
          </IonContent>
        ) : (
          <IonContent className="ion-padding">
            {/* Tampilan Sukses */}
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '76px', color: '#0f9755' }} />
              <h2 style={{ fontWeight: 'bold', margin: '12px 0' }}>Sekolah Berhasil Ditambahkan!</h2>
              <p style={{ color: '#666', fontSize: '14px' }}>Data sekolah beserta titik koordinatnya telah tersimpan di database.</p>
              <IonButton expand="block" color="success" onClick={handleResetSchoolModal} style={{ marginTop: '24px' }}>Tutup</IonButton>
            </div>
          </IonContent>
        )}
      </IonModal>
    </IonPage>
  );
};

export default TambahReport;