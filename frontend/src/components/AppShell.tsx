// AppShell.tsx
import React, { } from 'react';

import { AppBar, Box, Container, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import '../styles/App.css';

// ---------------------- AppShell ----------------------
const AppShell: React.FC = () => {

  const handleOpenSettingsDialog = (event: React.MouseEvent<HTMLElement>) => {
    console.log('handleOpenSettingsDialog');
  };

  return (
    <Box id="mainLayoutContainer" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar
        id="shweatherAppBar"
        position="static"
      >
        <Toolbar id="toolBar">

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shweather
          </Typography>

          <IconButton onClick={handleOpenSettingsDialog} color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
        <Box mb={2}>
          flibbet
        </Box>
      </Container>
    </Box>
  );
};

export default AppShell;
