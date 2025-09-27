// AppShell.tsx
import React, { JSX, useEffect, useState } from 'react';

import { AppBar, Box, CssBaseline, IconButton, Paper, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationAutocomplete from './LocationAutocomplete';
import GoogleMapsProvider from './GoogleMapsProvider';
import { ForecastView, ShWeatherLocation } from '../types/types';
import { AppDispatch, fetchDailyForecast, fetchHourlyForecast, selectForecastView, selectLastLocation, setForecastView, setLastLocation, setRecentLocations } from '../redux';
import { useDispatch, useSelector } from 'react-redux';
import Forecast from './Forecast';

// ---------------------- AppShell ----------------------
const AppShell: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  const forecastView: ForecastView = useSelector(selectForecastView);
  const lastLocation: ShWeatherLocation | null = useSelector(selectLastLocation);

  const [placeName, setPlaceName] = useState('');
  const [activeLocationLabel, setActiveLocationLabel] = useState('');

  useEffect(() => {
    // guard: avoid double-run in React 18 StrictMode (dev)
    if ((window as any).__shweather_init_done__) return;
    (window as any).__shweather_init_done__ = true;

    const getForecastView = (): ForecastView => {
      const forecastView = localStorage.getItem('forecastView');
      return forecastView === 'hourly' ? 'hourly' : 'daily';
    };

    const getLastLocation = (): ShWeatherLocation | null => {
      const lastLocation = localStorage.getItem('lastLocation');
      return lastLocation ? JSON.parse(lastLocation) as ShWeatherLocation : null;
    };

    const getRecentLocations = (): ShWeatherLocation[] => {
      const recent = localStorage.getItem('recentLocations');
      return recent ? (JSON.parse(recent) as ShWeatherLocation[]) : [];
    };

    const startupForecastView = getForecastView();
    dispatch(setForecastView(startupForecastView));

    dispatch(setRecentLocations(getRecentLocations()));

    const lastLocation = getLastLocation();
    dispatch(setLastLocation(lastLocation));

    if (lastLocation) {
      setActiveLocationLabel(lastLocation.friendlyPlaceName);
      if (startupForecastView === 'daily') {
        dispatch(fetchDailyForecast({ location: lastLocation.geometry.location }));
      } else {
        dispatch(fetchHourlyForecast({ location: lastLocation.geometry.location }));
      }
    }
  }, [dispatch]);

  const handleChangeForecastView = (_: React.SyntheticEvent, newForecastView: ForecastView) => {
    dispatch(setForecastView(newForecastView));
    try {
      localStorage.setItem('forecastView', newForecastView);
    } catch { }
    if (lastLocation === null) return;
    if (newForecastView === 'hourly') {
      dispatch(fetchHourlyForecast({ location: lastLocation.geometry.location }));
    } else {
      dispatch(fetchDailyForecast({ location: lastLocation.geometry.location }));
    }
  };

  const handleSetShWeatherLocation = async (shWeatherLocation: ShWeatherLocation) => {
    localStorage.setItem('lastLocation', JSON.stringify(shWeatherLocation));
    dispatch(setLastLocation(shWeatherLocation));
    if (forecastView === 'hourly') {
      dispatch(fetchHourlyForecast({ location: shWeatherLocation.geometry.location }));
    } else {
      dispatch(fetchDailyForecast({ location: shWeatherLocation.geometry.location }));
    }
    setActiveLocationLabel(shWeatherLocation.friendlyPlaceName); // ✅ keep header in sync
  };

  const handleOpenSettingsDialog = (event: React.MouseEvent<HTMLElement>) => {
    console.log('handleOpenSettingsDialog');
  };

  const renderWeather = (): JSX.Element => {

    return (
      <Paper
        id="weather-page"
        style={{
          padding: '24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          id="weather-page-header"
          sx={{ mb: 2, width: '100%' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, mb: 2 }}>
            <LocationAutocomplete
              placeName={placeName}
              onSetPlaceName={(name: string) => setPlaceName(name)}
              onSetShWeatherLocation={handleSetShWeatherLocation}
            />
          </Box>

          <Typography variant="h6" component="h1" gutterBottom>
            {forecastView === 'daily' ? '10 Day Weather' : 'Hourly Weather'} — {activeLocationLabel || 'Select a location'}
          </Typography>

          <Tabs
            value={forecastView}
            onChange={handleChangeForecastView}
            aria-label="Forecast view switch"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 1 }}
          >
            <Tab value="daily" label="10-Day" />
            <Tab value="hourly" label="Hourly" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 1 }}>
          <Forecast key={forecastView} />
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
