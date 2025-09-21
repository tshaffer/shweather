import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
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
  ListItemSecondaryAction,
  Button
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Autocomplete } from '@react-google-maps/api';
import { SelectChangeEvent } from '@mui/material/Select';
import { RecentLocation } from '../types';
import { useSelector } from 'react-redux';
import { selectRecentLocations, setRecentLocations } from '../redux';
import { Location } from '../types';

interface LocationAutocompleteProps {
  // onSetMapLocation: (mapLocation: google.maps.LatLngLiteral) => void;
  placeName: string;
  onSetPlaceName: (placeName: string) => void;         // we'll set this to the exact dropdown label
  onSetGoogleLocation: (googleLocation: Location, placeName: string) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = (props) => {
  const { placeName, onSetPlaceName, onSetGoogleLocation } = props;

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

  function buildLocation(googlePlaceResult: google.maps.places.PlaceResult): Location {
    const location: Location = {
      googlePlaceId: googlePlaceResult.place_id!,
      name: googlePlaceResult.name!,
      geometry: {
        location: {
          lat: googlePlaceResult.geometry!.location!.lat(),
          lng: googlePlaceResult.geometry!.location!.lng(),
        },
      },
    };
    return location;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onSetPlaceName(val); // keep your controlled input in sync

    if (!autocompleteServiceRef.current) return;

    const request: google.maps.places.AutocompletionRequest = {
      input: val,
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

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace() as google.maps.places.PlaceResult | undefined;
    if (!place) return;
    
    // Prefer the *exact* label the user saw in the dropdown
    const matchedPrediction = place.place_id
      ? predictionsByIdRef.current.get(place.place_id)
      : undefined;

      let placeName: string = '';

    // If we found it, set your controlled field to the exact dropdown label.
    if (matchedPrediction?.description) {
      placeName = matchedPrediction.description;
    } else {
      // Fallback: use PlaceResult fields if prediction cache missed
      const fallback: string =
        place.formatted_address ??
        [place.name, place.vicinity].filter(Boolean).join(', ') ??
        placeName;
      placeName = fallback;
    }

    if (place.geometry?.location) {
      const googlePlace: Location = buildLocation(place);
      onSetGoogleLocation(googlePlace, placeName);
    } else {
      console.error('No place geometry found in handlePlaceChanged');
    }

    // Start a new session after a successful selection (best practice)
    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
  };




  const inputRef = useRef<HTMLInputElement | null>(null);

  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>('');

  const recentLocations: RecentLocation[] = useSelector(selectRecentLocations);

  const [manageDialogOpen, setManageDialogOpen] = useState(false);

  // Get device's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(location);
      },
      (error) => console.error('Error getting current location: ', error),
      { enableHighAccuracy: true }
    );
  }, []);


  const handleUseCurrentLocation = () => {
    console.log('Use Current Location clicked');
    // if (currentLocation) {
    //   onSetMapLocation(currentLocation);
    //   setSelectedLocationKey(''); // Clear dropdown
    // }
  };

  const handleMapLocationChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location && place.formatted_address) {
        const newCoordinates = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        const newLocation: RecentLocation = {
          label: place.formatted_address,
          lat: newCoordinates.lat,
          lng: newCoordinates.lng,
        };

        // Check for duplicates
        const exists = recentLocations.some(loc => loc.label === newLocation.label);
        let updatedLocations = [...recentLocations];
        if (!exists) {
          updatedLocations.push(newLocation);
          dispatch(setRecentLocations(updatedLocations));
          localStorage.setItem('recentLocations', JSON.stringify(updatedLocations));
        }

        // onSetMapLocation(newCoordinates);
      } else {
        console.error('No place found in handleMapLocationChanged');
      }
    }
  };

  const handleDeleteLocation = (labelToDelete: string) => {
    const updated = recentLocations.filter(loc => loc.label !== labelToDelete);
    dispatch(setRecentLocations(updated));
    localStorage.setItem('recentLocations', JSON.stringify(updated));

    if (labelToDelete === selectedLocationKey) {
      setSelectedLocationKey('');
    }
  };

  const handleLocationSelect = (event: SelectChangeEvent<string>) => {
    console.log('Location selected from dropdown');
    // const key = event.target.value;
    // setSelectedLocationKey(key);

    // const selected = recentLocations.find(loc => loc.label === key);
    // if (selected) {
    //   onSetMapLocation({ lat: selected.lat, lng: selected.lng });
    // }
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
      <Tooltip title="Use Current Location">
        <IconButton
          onClick={handleUseCurrentLocation}
          sx={{
            backgroundColor: '#007bff',
            color: '#fff',
            '&:hover': { backgroundColor: '#0056b3' },
          }}
        >
          <MyLocationIcon />
        </IconButton>
      </Tooltip>

      <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
        Location:
      </Typography>

      <Select
        value={selectedLocationKey}
        onChange={handleLocationSelect}
        displayEmpty
        size="small"
        sx={{ minWidth: 180, flexGrow: 1 }}
      >
        <MenuItem value="" disabled>
          Select a location
        </MenuItem>
        {recentLocations.map((loc) => (
          <MenuItem key={loc.label} value={loc.label}>
            {loc.label}
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
            {recentLocations
              .slice()
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((loc) => (
                <ListItem
                  key={loc.label}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteLocation(loc.label)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={loc.label} />
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default LocationAutocomplete;
