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
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
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

const jabatanOptions = ['Marketing', 'Sales Executive', 'Supervisor', 'Manager', 'Lainnya'];

const ProfilePage: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jabatan, setJabatan] = useState('');

  const [googleIdentity, setGoogleIdentity] = useState<UserIdentity | null>(null);
  const [connecting, setConnecting] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const loadAll = async () => {
    setLoading(true);
    const data = await getProfile();
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
    setJabatan(data.jabatan);

    const { data: identitiesData } = await supabase.auth.getUserIdentities();
    const google = identitiesData?.identities.find((i) => i.provider === 'google') ?? null;
    setGoogleIdentity(google);

    setLoading(false);
  };

  useEffect(() => {
    loadAll();
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
    // Setelah ini browser akan redirect ke Google, lalu kembali otomatis
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
    await saveProfile({ name, email, phone, jabatan });
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

        {/* Modal: Informasi Akun */}
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
          <IonContent className="profile-modal-content">
            <IonItem lines="none" className="login-field">
              <IonLabel position="stacked">Nama Lengkap</IonLabel>
              <IonInput value={name} onIonInput={(e) => setName(e.detail.value ?? '')} />
            </IonItem>
            <IonItem lines="none" className="login-field">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput value={email} readonly />
            </IonItem>
            <IonItem lines="none" className="login-field">
              <IonLabel position="stacked">No. Telepon</IonLabel>
              <IonInput value={phone} onIonInput={(e) => setPhone(e.detail.value ?? '')} placeholder="08xxxxxxxxxx" />
            </IonItem>
            <IonItem lines="none" className="login-field">
              <IonLabel position="stacked">Jabatan</IonLabel>
              <IonSelect value={jabatan} onIonChange={(e) => setJabatan(e.detail.value)} interface="popover">
                {jabatanOptions.map((j) => (
                  <IonSelectOption key={j} value={j}>{j}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonButton expand="block" className="primary-btn" onClick={handleSaveInfo}>
              Simpan Profil
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal: Ubah Password */}
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
          <IonContent className="profile-modal-content">
            <IonItem lines="none" className="login-field">
              <IonLabel position="stacked">Password Baru</IonLabel>
              <IonInput type="password" value={newPassword} onIonInput={(e) => setNewPassword(e.detail.value ?? '')} />
            </IonItem>
            <IonItem lines="none" className="login-field">
              <IonLabel position="stacked">Konfirmasi Password</IonLabel>
              <IonInput type="password" value={confirmPassword} onIonInput={(e) => setConfirmPassword(e.detail.value ?? '')} />
            </IonItem>
            <IonButton expand="block" className="primary-btn" onClick={handleChangePassword}>
              Simpan Password
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;