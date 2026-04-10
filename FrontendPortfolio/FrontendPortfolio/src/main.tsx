import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Redux
import { Provider } from 'react-redux';
import store from './Redux/store';

// Mantine
import { MantineProvider } from '@mantine/core';

// App
import App from './App';

// Keycloak Provider
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloak } from './helpers/api/apiCore'; // <-- on prend l'instance unique

/**
 * main.tsx :
 * - ReactKeycloakProvider initialise Keycloak au boot
 * - Provider Redux garde ton store global
 * - MantineProvider garde ton thème UI
 * - Suspense pour lazy/i18n
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          onLoad: 'login-required', // force login   "'"  si pas connecté  <> check-sso
          pkceMethod: 'S256', // recommandé pour SPA
          checkLoginIframe: false, // évite polls iframe
        }}
      >
        <Provider store={store}>
          <MantineProvider>
            <App />
          </MantineProvider>
        </Provider>
      </ReactKeycloakProvider>
    </Suspense>
  </React.StrictMode>
);
