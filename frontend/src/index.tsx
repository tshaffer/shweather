// index.tsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import WeathersenPage from './components/ShweatherPage';
import { initializeDiagnostics, loadEnvConfig } from './utilities';
import { store } from './redux/store';

window.React = React;

initializeDiagnostics();

loadEnvConfig().then(() => {
  createRoot(document.getElementById('content')!).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
            <WeathersenPage />
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
});
