// AppShell.tsx
import React, { } from 'react';

import { AppBar, Box, Container, CssBaseline, Divider, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';

import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// ---------------------- AppShell ----------------------
const AppShell: React.FC = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Shweather</Typography>
          <Tooltip title="Refresh (placeholder)">
            <IconButton size="small"><RefreshIcon /></IconButton>
          </Tooltip>
        </Toolbar>
        <Divider />
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
        <Box mb={2}>
          pizza
        </Box>
      </Container>
    </Box>
  );
};

export default AppShell;
