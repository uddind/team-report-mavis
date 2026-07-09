import { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonItem,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import type { UserIdentity } from '@supabase/supabase-js';
import {
  personOutline,
  logoGoogle,
  chevronForwardOutline,
  lockClosedOutline,
  informationCircleOutline,
  logOutOutline,
  closeOutline,
  checkmarkCircle,
} from 'ionicons/icons';
import { supabase } from '../services/supabaseClient';
import { getProfile, saveProfile } from '../services/profileService';
import { isAdminEmail } from '../utils/adminEmails';
import './Profile.css';

// Pilihan kota untuk Area
const areaOptions = ['Blitar', 'Kediri', 'Malang', 'Madiun', 'Nganjuk', 'Ngawi', 'Pacitan', 'Ponorogo', 'Trenggalek', 'Tulungagung'];

const ProfilePage: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState(''); // State lokal aplikasi menggunakan nama 'area'

  const [googleIdentity, setGoogleIdentity] = useState<UserIdentity | null>(null);
  const [connecting, setConnecting] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

const loadAll = async () => {
    setLoading(true);

    try {
      // 1. Ambil data sesi user yang sedang aktif langsung dari Supabase Auth
      const { data: { user } } = await supabase.auth.getUser();

      const data = await getProfile();
      setName(data.name);
      setPhone(data.phone);
      setArea((data as any).area || data.jabatan || '');

      // 2. Jika di profile kustom tidak ada email, gunakan email dari akun login utama
      setEmail(data.email || user?.email || '');

      const { data: identitiesData, error } = await supabase.auth.getUserIdentities();
      if (error) {
        console.error('Gagal ambil identities:', error);
      }
      const google = identitiesData?.identities.find((i) => i.provider === 'google') ?? null;
      setGoogleIdentity(google);
    } catch (err) {
      console.error('loadAll error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    // Setelah redirect balik dari Google (proses linking), Supabase butuh
    // sedikit waktu memproses token di URL — dengarkan perubahan status auth
    // dan muat ulang data supaya tombol "Putuskan Koneksi" muncul dengan benar.
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadAll();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const initial = name.trim() ? name.trim()[0].toUpperCase() : '';
  const roleLabel = isAdminEmail(email) ? 'Admin' : 'Staff';

  const handleConnectGoogle = async () => {
    setConnecting(true);
    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/profile` },
    });
    if (error) {
      presentToast({ message: error.message, duration: 2500, color: 'danger', position: 'top' });
      setConnecting(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    if (!googleIdentity) return;
    const { error } = await supabase.auth.unlinkIdentity(googleIdentity);
    if (error) {
      presentToast({ message: error.message, duration: 2500, color: 'danger', position: 'top' });
      return;
    }
    presentToast({ message: 'Koneksi Google diputuskan', duration: 2000, color: 'success', position: 'top' });
    loadAll();
  };

  const handleSaveInfo = async () => {
    // Trik Aman: Kirimkan nilai 'area' baik ke properti 'area' maupun 'jabatan' 
    // agar profileService tidak komplain apa pun strukturnya di database
    await saveProfile({ 
      name, 
      email, 
      phone, 

      area: area     // mengantisipasi database baru
    } as any); 

    presentToast({ message: 'Profil berhasil disimpan', duration: 2000, color: 'success', position: 'top' });
    setShowInfoModal(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      presentToast({ message: 'Password minimal 6 karakter', duration: 2000, color: 'danger', position: 'top' });
      return;
    }
    if (newPassword !== confirmPassword) {
      presentToast({ message: 'Konfirmasi password tidak cocok', duration: 2000, color: 'danger', position: 'top' });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      presentToast({ message: error.message, duration: 2500, color: 'danger', position: 'top' });
      return;
    }
    presentToast({ message: 'Password berhasil diubah', duration: 2000, color: 'success', position: 'top' });
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/beranda');
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen className="profile-content">
          <div className="loading-state">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="profile-content">
        <div className="profile-header-row">
          <IonButton fill="clear" size="small" onClick={() => router.goBack()}>
            <IonIcon icon={chevronForwardOutline} style={{ transform: 'rotate(180deg)' }} slot="start" />
            Profil
          </IonButton>
        </div>

        <div className="profile-hero">
          <div className="profile-avatar-circle">
            {initial || <IonIcon icon={personOutline} />}
          </div>
          <h2 className="profile-hero-name">{name || 'Nama Belum Diisi'}</h2>
          <span className="profile-hero-role">{roleLabel}</span>
          <p className="profile-hero-email">{email}</p>
        </div>

        <div className="profile-card fade-in">
          <div className="profile-card-header">
            <span className="profile-card-title">Google Account</span>
            <span className={`google-badge ${googleIdentity ? 'connected' : ''}`}>
              {googleIdentity ? (
                <>
                  <IonIcon icon={checkmarkCircle} /> Connected
                </>
              ) : (
                'Belum Terhubung'
              )}
            </span>
          </div>

          {googleIdentity ? (
            <>
              <div className="google-connected-row">
                <IonIcon icon={logoGoogle} className="google-icon" />
                <div>
                  <p className="google-connected-email">{googleIdentity.identity_data?.email as string}</p>
                  <p className="google-connected-date">
                    Terhubung pada{' '}
                    {googleIdentity.created_at
                      ? new Date(googleIdentity.created_at).toLocaleString('id-ID')
                      : '-'}
                  </p>
                </div>
              </div>
              <IonButton expand="block" fill="outline" color="danger" onClick={handleDisconnectGoogle}>
                Putuskan Koneksi
              </IonButton>
            </>
          ) : (
            <>
              <p className="google-hint-text">
                Hubungkan akun Google agar login berikutnya cukup satu klik.
              </p>
              <IonButton expand="block" fill="outline" className="connect-google-btn" onClick={handleConnectGoogle} disabled={connecting}>
                <IonIcon icon={logoGoogle} slot="start" />
                Connect to Google
              </IonButton>
            </>
          )}
        </div>

        <div className="profile-list-card fade-in">
          <div className="profile-list-item" onClick={() => setShowInfoModal(true)}>
            <IonIcon icon={personOutline} className="profile-list-icon" />
            <span className="profile-list-label">Informasi Akun</span>
            <IonIcon icon={chevronForwardOutline} className="profile-list-arrow" />
          </div>
          <div className="profile-list-item" onClick={() => setShowPasswordModal(true)}>
            <IonIcon icon={lockClosedOutline} className="profile-list-icon" />
            <span className="profile-list-label">Ubah Password</span>
            <IonIcon icon={chevronForwardOutline} className="profile-list-arrow" />
          </div>
          <div className="profile-list-item no-arrow">
            <IonIcon icon={informationCircleOutline} className="profile-list-icon" />
            <span className="profile-list-label">Tentang Aplikasi</span>
            <span className="profile-list-version">v1.0.0</span>
          </div>
        </div>

        <div className="profile-logout-row">
          <IonButton expand="block" fill="clear" color="danger" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Logout
          </IonButton>
        </div>

        {/* Modal Pop-up: Informasi Akun */}
        <IonModal isOpen={showInfoModal} onDidDismiss={() => setShowInfoModal(false)} className="profile-modal">
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <IonTitle>Informasi Akun</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowInfoModal(false)}>
                  <IonIcon icon={closeOutline} slot="icon-only" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="profile-modal-content ion-padding">
            <IonItem lines="none" className="login-field">
              <IonInput 
                label="Nama Lengkap" 
                labelPlacement="stacked" 
                value={name} 
                onIonInput={(e: any) => setName(e.detail.value ?? '')}
              />
            </IonItem>
            
            <IonItem lines="none" className="login-field">
              <IonInput 
                label="Email" 
                labelPlacement="stacked" 
                value={email} 
                readonly 
              />
            </IonItem>
            
            <IonItem lines="none" className="login-field">
              <IonInput 
                label="No. Telepon" 
                labelPlacement="stacked" 
                value={phone} 
                onIonInput={(e: any) => setPhone(e.detail.value ?? '')}
                placeholder="08xxxxxxxxxx" 
              />
            </IonItem>
            
            {/* Pilihan Dropdown Area */}
            <IonItem lines="none" className="login-field">
              <IonSelect 
                label="Area" 
                labelPlacement="stacked" 
                value={area} 
                onIonChange={(e: any) => setArea(e.detail.value)}
                interface="popover"
              >
                {areaOptions.map((a) => (
                  <IonSelectOption key={a} value={a}>{a}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            
            <IonButton expand="block" className="primary-btn" onClick={handleSaveInfo} style={{ marginTop: '20px' }}>
              Simpan Profil
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal Pop-up: Ubah Password */}
        <IonModal isOpen={showPasswordModal} onDidDismiss={() => setShowPasswordModal(false)} className="profile-modal">
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <IonTitle>Ubah Password</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowPasswordModal(false)}>
                  <IonIcon icon={closeOutline} slot="icon-only" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="profile-modal-content ion-padding">
            <IonItem lines="none" className="login-field">
              <IonInput 
                label="Password Baru" 
                labelPlacement="stacked" 
                type="password" 
                value={newPassword} 
                onIonInput={(e: any) => setNewPassword(e.detail.value ?? '')}
              />
            </IonItem>
            <IonItem lines="none" className="login-field">
              <IonInput 
                label="Konfirmasi Password" 
                labelPlacement="stacked" 
                type="password" 
                value={confirmPassword} 
                onIonInput={(e: any) => setConfirmPassword(e.detail.value ?? '')}
              />
            </IonItem>
            <IonButton expand="block" className="primary-btn" onClick={handleChangePassword} style={{ marginTop: '20px' }}>
              Simpan Password
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;