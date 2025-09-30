import * as React from 'react';
import { Box } from '@mui/material';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { DailyForecastDay, fmtPct } from "../types";
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';


function formatTimeOfDayFromISO(isoString: string): string {
  return dayjs(isoString).format("h:mm a");
}

type IconSize = 'inherit' | 'small' | 'medium' | 'large';

interface SunArrowIconProps {
  fontSize?: IconSize;   // default 'small' to match your screenshot scale
  color?: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

/** Sunrise: sun with up arrow centered above the horizon */
export const SunriseIcon: React.FC<SunArrowIconProps> = ({
  fontSize = 'small',
  color = 'inherit',
}) => {
  // Slight tweaks so the arrow sits neatly above the sun across sizes
  const arrowPx = { small: 14, medium: 18, large: 22, inherit: 16 }[fontSize];
  const topNudge = { small: -2, medium: -3, large: -4, inherit: -2 }[fontSize];

  return (
    <Box sx={{ position: 'relative', lineHeight: 0, display: 'inline-block' }}>
      <WbTwilightIcon fontSize={fontSize} color={color} />
      <ArrowUpwardIcon
        color={color}
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: topNudge,
          fontSize: arrowPx, // make arrow a touch smaller than the sun
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

/** Sunset: sun with down arrow centered over the sun */
export const SunsetIcon: React.FC<SunArrowIconProps> = ({
  fontSize = 'small',
  color = 'inherit',
}) => {
  const arrowPx = { small: 14, medium: 18, large: 22, inherit: 16 }[fontSize];
  const topNudge = { small: 2, medium: 3, large: 4, inherit: 2 }[fontSize];

  return (
    <Box sx={{ position: 'relative', lineHeight: 0, display: 'inline-block' }}>
      <WbTwilightIcon fontSize={fontSize} color={color} />
      <ArrowDownwardIcon
        color={color}
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: topNudge, // sits just above the sun line
          fontSize: arrowPx,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default function ForecastDetails({ 
  dailyForecastDay,
  columnWidths,
 }: { 
  dailyForecastDay: DailyForecastDay,
  columnWidths: Partial<{ humidity: number; uvIndex: number; sunrise: number; sunset: number }>
 }) {

  const w = {
    humidity: columnWidths.humidity,
    uvIndex: columnWidths.uvIndex,
    sunrise: columnWidths.sunrise,
    sunset: columnWidths.sunset,
  };

  const relativeHumidity: string = dailyForecastDay.daytimeForecast?.relativeHumidity !== undefined
    ? fmtPct(dailyForecastDay.daytimeForecast.relativeHumidity)
    : '';

  const uvIndex: string = dailyForecastDay.daytimeForecast?.uvIndex !== undefined
    ? `${dailyForecastDay.daytimeForecast.uvIndex} of 11`
    : '';

  const sunrise: string = dailyForecastDay.sunEvents?.sunriseTime !== undefined
    ? `${formatTimeOfDayFromISO(dailyForecastDay.sunEvents.sunriseTime)}`
    : '';

  const sunset: string = dailyForecastDay.sunEvents?.sunsetTime !== undefined
    ? `${formatTimeOfDayFromISO(dailyForecastDay.sunEvents.sunsetTime)}`
    : '';

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "nowrap", ml: 1, whiteSpace: "nowrap" }}>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.humidity, flexShrink: 0 }}>
        <OpacityIcon fontSize="small" />
        <Typography variant="body2">Humidity {relativeHumidity}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.uvIndex, flexShrink: 0 }}>
        <WbSunnyIcon fontSize="small" />
        <Typography variant="body2">UV Index {uvIndex}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.sunrise, flexShrink: 0 }}>
        <SunriseIcon />
        <Typography variant="body2">Sunrise {sunrise}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.sunset, flexShrink: 0 }}>
        <SunsetIcon />
        <Typography variant="body2">Sunset {sunset}</Typography>
      </Stack>

    </Stack>
  );
}

