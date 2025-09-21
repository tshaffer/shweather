// AppShell.tsx
import React, { JSX, useState } from 'react';

import { AppBar, Box, Container, CssBaseline, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationAutocomplete from './LocationAutocomplete';
import GoogleMapsProvider from './GoogleMapsProvider';
import { Location } from '../types';
import { AppDispatch, fetchForecast } from '../redux';
import { useDispatch } from 'react-redux';
import Forecast from './Forecast';

// Define LatLngLiteral type
type LatLngLiteral = {
  lat: number;
  lng: number;
};

// ---------------------- AppShell ----------------------
const AppShell: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();

  const [placeName, setPlaceName] = useState('');

  const handleChangeGooglePlace = async (
    googlePlace: Location,
    placeName: string,
  ) => {
    dispatch(fetchForecast({ location: googlePlace.geometry.location }));
    // updateStop(index, { placeName, location: googlePlace });
  };

  const handleOpenSettingsDialog = (event: React.MouseEvent<HTMLElement>) => {
    console.log('handleOpenSettingsDialog');
  };

  // function handleSetMapLocation(mapLocation: LatLngLiteral): void {
  //   console.log('handleSetMapLocation called with mapLocation:', mapLocation);
  // }

  const renderLocationChoose = (): JSX.Element => {

    return (
      <Paper
        id="map-page"
        style={{
          display: 'flex',
          flexDirection: 'column',
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
            display: 'flex',
            alignItems: 'center',
            gap: 1,
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
            />
          </Box>
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
          {renderLocationChoose()}
        </Box>

      </Box>
    </GoogleMapsProvider>
  );
};

export default AppShell;
