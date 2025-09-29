import { Stack, Typography } from "@mui/material";
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

import { ForecastHour } from "../types";

export default function HourlyForecastDetails({ hourlyForecast }: { hourlyForecast: ForecastHour }) {

  const relativeHumidity = hourlyForecast.relativeHumidity;
  const uvIndex = hourlyForecast.uvIndex;

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "nowrap", ml: 1, whiteSpace: "nowrap" }}>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: 150, flexShrink: 0 }}>
        <OpacityIcon fontSize="small" />
        <Typography variant="body2">Humidity {relativeHumidity}%</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: 150, flexShrink: 0 }}>
        <WbSunnyIcon fontSize="small" />
        <Typography variant="body2">UV Index {uvIndex} of 11</Typography>
      </Stack>

    </Stack>
  );
}

