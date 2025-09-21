// AppShell.tsx
import React, { } from 'react';
import GoogleMapsProvider from './GoogleMapsProvider';

// ---------------------- AppShell ----------------------
const AppShell: React.FC = () => {

  return (
    <GoogleMapsProvider>
      <div>pizza</div>
    </GoogleMapsProvider>
  );
};

export default AppShell;
