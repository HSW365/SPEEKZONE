import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import('@ionic/pwa-elements/loader').then(({ defineCustomElements }) => {
  defineCustomElements(window).catch(() => {});
}).catch(() => {});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
