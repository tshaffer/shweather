// AppShell.tsx
import React, { JSX, useEffect, useState } from 'react';

import { AppBar, Box, CssBaseline, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationAutocomplete from './LocationAutocomplete';
import GoogleMapsProvider from './GoogleMapsProvider';
import { Location, RecentLocation } from '../types';
import { AppDispatch, fetchForecast, setRecentLocations } from '../redux';
import { useDispatch } from 'react-redux';
import Forecast from './Forecast';

// ---------------------- AppShell ----------------------
const AppShell: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  const [placeName, setPlaceName] = useState('');

  useEffect(() => {
    console.log('getLocalStorage useEffect called');

    const getRecentLocations = (): RecentLocation[] => {
      const recentLocations: string | null = localStorage.getItem('recentLocations');
      if (recentLocations) {
        return JSON.parse(recentLocations);
      } else {
        return [];
      }
    };

    const recentLocations = getRecentLocations();
    console.log("recentLocations:", recentLocations);
    dispatch(setRecentLocations(recentLocations));

  }, []);


  const handleChangeGooglePlace = async (
    googlePlace: Location,
    placeName: string,
  ) => {
    dispatch(fetchForecast({ location: googlePlace.geometry.location }));
    // updateStop(index, { placeName, location: googlePlace });
  };

  const handleSelectRecentLocation = (location: RecentLocation) => {
    dispatch(fetchForecast({ location: { lat: location.lat, lng: location.lng } }));
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
            sx={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}
          >
            <LocationAutocomplete
              placeName={placeName || ""}
              onSetPlaceName={(name: string) => setPlaceName(name)}
              onSetGoogleLocation={(googlePlace: Location, placeName: string) =>
                handleChangeGooglePlace(
                  googlePlace,
                  placeName,
                )
              }
              onSelectRecentLocation={(location: any) => handleSelectRecentLocation(location)}
            />
          </Box>
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
