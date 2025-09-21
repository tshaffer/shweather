// index.tsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import ShweatherPage from './components/ShweatherPage';
import GoogleMapsProvider from './components/GoogleMapsProvider';
import { initializeDiagnostics, loadEnvConfig } from './utilities';
import { store } from './redux/store';

window.React = React;

initializeDiagnostics();

loadEnvConfig().then(() => {
  createRoot(document.getElementById('content')!).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <GoogleMapsProvider>
            <ShweatherPage />
          </GoogleMapsProvider>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
});
