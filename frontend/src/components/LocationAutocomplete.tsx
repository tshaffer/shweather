import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Autocomplete } from '@react-google-maps/api';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { selectRecentLocations, setRecentLocations } from '../redux';
import { ShWeatherLocation } from '../types';

interface LocationAutocompleteProps {
  placeName: string;
  onSetPlaceName: (friendlyPlaceName: string) => void;         // we'll set this to the exact dropdown label
  onSetShWeatherLocation: (shWeatherLocation: ShWeatherLocation) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = (props) => {
  const { placeName, onSetPlaceName, onSetShWeatherLocation } = props;

  const dispatch = useDispatch();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const predictionsByIdRef = useRef<Map<string, google.maps.places.AutocompletePrediction>>(
    new Map()
  );

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (!('google' in window)) return;
    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    }
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  function buildShWeatherLocation(friendlyPlaceName: string, googlePlaceResult: google.maps.places.PlaceResult): ShWeatherLocation {
    const shWeatherLocation: ShWeatherLocation = {
      googlePlaceId: googlePlaceResult.place_id!,
      friendlyPlaceName: friendlyPlaceName,
      geometry: {
        location: {
          lat: googlePlaceResult.geometry!.location!.lat(),
          lng: googlePlaceResult.geometry!.location!.lng(),
        },
      },
    };
    return shWeatherLocation;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const placeNameUserInput = e.target.value;

    console.log('handleInputChange: ', placeNameUserInput);
    onSetPlaceName(placeNameUserInput); // keep your controlled input in sync

    if (!autocompleteServiceRef.current) return;

    const request: google.maps.places.AutocompletionRequest = {
      input: placeNameUserInput,
      sessionToken: sessionTokenRef.current ?? undefined,
      // You can add: componentRestrictions: { country: ['us'] }, types: ['geocode']
    };

    autocompleteServiceRef.current.getPlacePredictions(request, (predictions) => {
      predictionsByIdRef.current.clear();
      (predictions ?? []).forEach((p) => {
        predictionsByIdRef.current.set(p.place_id, p);
      });
    });
  };

  const [selectedLocationKey, setSelectedLocationKey] = useState<string>('');

  const recentLocations: ShWeatherLocation[] = useSelector(selectRecentLocations);

  const [manageDialogOpen, setManageDialogOpen] = useState(false);

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace() as google.maps.places.PlaceResult | undefined;
    if (!place) return;

    const matchedPrediction = place.place_id
      ? predictionsByIdRef.current.get(place.place_id)
      : undefined;

    // Use a different name to avoid shadowing props.placeName
    const selectedLabel =
      matchedPrediction?.description ??
      place.formatted_address ??
      [place.name, place.vicinity].filter(Boolean).join(', ') ??
      '';

    // ✅ keep the input in sync with the selection
    onSetPlaceName(selectedLabel);

    if (place.geometry?.location) {
      const shweatherLocation = buildShWeatherLocation(selectedLabel, place);
      addRecentLocation(shweatherLocation);
      onSetShWeatherLocation(shweatherLocation);
    } else {
      console.error('No place geometry found in handlePlaceChanged');
    }

    // ⬇️ Blank the Recent Location dropdown
    setSelectedLocationKey('');

    // Reset session for next search
    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
  };

  const addRecentLocation = (shweatherLocation: ShWeatherLocation) => {
    // Remove any existing entry with the same placeId
    let updatedLocations = recentLocations.filter(
      loc => loc.googlePlaceId !== shweatherLocation.googlePlaceId
    );

    // Add new location at the front
    updatedLocations.unshift(shweatherLocation);

    // Limit to 15 locations
    if (updatedLocations.length > 15) {
      updatedLocations = updatedLocations.slice(0, 15);
    }
    saveRecentLocations(updatedLocations);
  };

  const handleDeleteLocation = (labelToDelete: string) => {
    const updated = recentLocations.filter(loc => loc.friendlyPlaceName !== labelToDelete);
    dispatch(setRecentLocations(updated));
    localStorage.setItem('recentLocations', JSON.stringify(updated));

    if (labelToDelete === selectedLocationKey) {
      setSelectedLocationKey('');
    }
  };

  const handleSelectRecentLocation = (event: SelectChangeEvent<string>) => {
    const key = event.target.value;
    setSelectedLocationKey(key);

    const selected = recentLocations.find(loc => loc.friendlyPlaceName === key);
    if (selected) {
      // clear the autocomplete text
      onSetPlaceName('');

      // notify parent (fetch forecast, etc.)
      onSetShWeatherLocation(selected);

      // ⬅️ move this location to the front (MRU)
      bumpRecentLocationToFront(selected);
    }
  };

  const saveRecentLocations = (arr: ShWeatherLocation[]) => {
    dispatch(setRecentLocations(arr));
    localStorage.setItem('recentLocations', JSON.stringify(arr));
  };

  const bumpRecentLocationToFront = (loc: ShWeatherLocation) => {
    // remove any existing instance, then unshift
    const updated = recentLocations.filter(l => l.googlePlaceId !== loc.googlePlaceId);
    updated.unshift(loc);
    saveRecentLocations(updated);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
        Location:
      </Typography>

      <Select
        value={selectedLocationKey}
        onChange={handleSelectRecentLocation}
        displayEmpty
        size="small"
        sx={{ minWidth: 180, flexGrow: 1 }}
      >
        <MenuItem value="" disabled>
          Select a location
        </MenuItem>
        {recentLocations.map((loc) => (
          <MenuItem key={loc.friendlyPlaceName} value={loc.friendlyPlaceName}>
            {loc.friendlyPlaceName}
          </MenuItem>
        ))}
      </Select>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
          // Request only the fields you need to reduce quota/latency.
          options={{
            fields: ['place_id', 'name', 'formatted_address', 'geometry', 'vicinity'],
            // componentRestrictions: { country: ['us'] },
            // types: ['geocode'],
          }}
        >
          <input
            type="text"
            placeholder="Enter a location"
            value={placeName}                     // controlled
            onChange={handleInputChange}          // UPDATED
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </Autocomplete>
      </Box>

      <Button
        size="small"
        startIcon={<ManageAccountsIcon />}
        onClick={() => setManageDialogOpen(true)}
        sx={{ marginLeft: 'auto', marginTop: 0 }}
      >
        Manage Locations
      </Button>


      <Dialog open={manageDialogOpen} onClose={() => setManageDialogOpen(false)}>
        <DialogTitle>Manage Saved Locations</DialogTitle>
        <DialogContent>
          <List dense>
            {recentLocations.map((loc) => (
              <ListItem
                key={loc.friendlyPlaceName}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteLocation(loc.friendlyPlaceName)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={loc.friendlyPlaceName} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default LocationAutocomplete;
