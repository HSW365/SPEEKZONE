import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { isWeb } from './utils/platform';

// PWA elements power a couple of Capacitor web components (e.g. camera UI on
// the web). Loaded lazily and failure-tolerant.
import('@ionic/pwa-elements/loader').then(({ defineCustomElements }) => {
  defineCustomElements(window).catch(() => {});
}).catch(() => {});

// Register the service worker only in the browser build — never inside the
// native iOS (Capacitor) shell, which serves from capacitor://localhost.
if (isWeb() && 'serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
