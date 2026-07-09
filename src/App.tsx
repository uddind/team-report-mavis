import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, addCircle, documentTextOutline } from 'ionicons/icons';
import { Session } from '@supabase/supabase-js';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './theme/tabs.css';

import Beranda from './pages/Beranda';
import Laporan from './pages/Laporan';
import TambahReport from './pages/TambahReport';
import DetailReport from './pages/DetailReport';
import EditReport from './pages/EditReport';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';

import { supabase } from './services/supabaseClient';

setupIonicReact();

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Cek session saat aplikasi dibuka
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Dengarkan perubahan login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/beranda" component={Beranda} />
            <Route exact path="/tambah-report" component={TambahReport} />
            <Route exact path="/laporan" component={Laporan} />
            <Route exact path="/detail-report/:id" component={DetailReport} />
            <Route exact path="/edit-report/:id" component={EditReport} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/">
              <Redirect to="/beranda" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="beranda" href="/beranda">
              <IonIcon icon={homeOutline} />
              <IonLabel>BERANDA</IonLabel>
            </IonTabButton>

            <IonTabButton tab="tambah-report" href="/tambah-report">
              <IonIcon icon={addCircle} />
            </IonTabButton>

            <IonTabButton tab="laporan" href="/laporan">
              <IonIcon icon={documentTextOutline} />
              <IonLabel>LAPORAN</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>

        {/* Modal hanya muncul jika belum login */}
        <LoginModal isOpen={!session} />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;