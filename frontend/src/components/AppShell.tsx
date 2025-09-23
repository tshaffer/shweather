// AppShell.tsx
import React, { JSX, useEffect, useState } from 'react';

import { AppBar, Box, CssBaseline, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationAutocomplete from './LocationAutocomplete';
import GoogleMapsProvider from './GoogleMapsProvider';
import { ShWeatherLocation } from '../types/types';
import { AppDispatch, fetchForecast, selectLastLocation, setLastLocation, setRecentLocations } from '../redux';
import { useDispatch, useSelector } from 'react-redux';
import Forecast from './Forecast';

// ---------------------- AppShell ----------------------
const AppShell: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  const lastLocation: ShWeatherLocation | null = useSelector(selectLastLocation);

  const [placeName, setPlaceName] = useState('');
  const [activeLocationLabel, setActiveLocationLabel] = useState(''); // NEW

  useEffect(() => {
    // guard: avoid double-run in React 18 StrictMode (dev)
    if ((window as any).__shweather_init_done__) return;
    (window as any).__shweather_init_done__ = true;

    const getLastLocation = (): ShWeatherLocation | null => {
      const lastLocation = localStorage.getItem('lastLocation');
      return lastLocation ? JSON.parse(lastLocation) as ShWeatherLocation : null;
    };

    const getRecentLocations = (): ShWeatherLocation[] => {
      const recent = localStorage.getItem('recentLocations');
      return recent ? (JSON.parse(recent) as ShWeatherLocation[]) : [];
    };

    const lastLocation = getLastLocation();
    console.log('lastLocation:', lastLocation);
    dispatch(setLastLocation(lastLocation));
    dispatch(setRecentLocations(getRecentLocations()));

    if (lastLocation) {
      // ✅ ensure the header shows the saved location on startup
      setActiveLocationLabel(lastLocation.friendlyPlaceName);
      dispatch(fetchForecast({ location: lastLocation.geometry.location }));
    }
  }, [dispatch]);


  const handleSetShWeatherLocation = async (shWeatherLocation: ShWeatherLocation) => {
    localStorage.setItem('lastLocation', JSON.stringify(shWeatherLocation));
    dispatch(setLastLocation(shWeatherLocation));
    dispatch(fetchForecast({ location: shWeatherLocation.geometry.location }));
    setActiveLocationLabel(shWeatherLocation.friendlyPlaceName); // ✅ keep header in sync
  };

  const handleOpenSettingsDialog = (event: React.MouseEvent<HTMLElement>) => {
    console.log('handleOpenSettingsDialog');
  };

  const renderWeather = (): JSX.Element => {

    return (
      <Paper
        id="map-page"
        style={{
          padding: '24px',
          minHeight: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          id="map-page-header"
          sx={{
            marginBottom: 2,
            width: '100%',
          }}
        >
          <Box
            id="map-page-locationAutocomplete-container"
            sx={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0, marginBottom: 2 }}
          >
            <LocationAutocomplete
              placeName={placeName}
              onSetPlaceName={(name: string) => setPlaceName(name)}
              onSetShWeatherLocation={(shWeatherLocation: ShWeatherLocation) => handleSetShWeatherLocation(shWeatherLocation)}
            />
          </Box>
          <Typography variant="h6" component="h1" gutterBottom>
            10 Day Weather - {activeLocationLabel || 'Select a location'}
          </Typography>

          {/* 10 day forecast */}
          <Forecast />
        </Box>
      </Paper>
    );

  };

  return (
    <GoogleMapsProvider>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CssBaseline />
        <AppBar
          position="static"
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Shweather
            </Typography>
            <IconButton onClick={handleOpenSettingsDialog} color="inherit">
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box id="mainAppContentArea" sx={{ flexGrow: 1, overflow: 'hidden' }}>
          {renderWeather()}
        </Box>

      </Box>
    </GoogleMapsProvider>
  );
};

export default AppShell;
