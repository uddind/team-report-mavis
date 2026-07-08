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

setupIonicReact();

const App: React.FC = () => (
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

      <LoginModal isOpen={true} />
    </IonReactRouter>
  </IonApp>
);

export default App;