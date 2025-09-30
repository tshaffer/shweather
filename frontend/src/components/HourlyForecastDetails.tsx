import { Stack, Typography } from "@mui/material";
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

import { fmtPct, ForecastHour, HourlyForecastDetailsColumnWidths } from "../types";

export default function HourlyForecastDetails({
  hourlyForecast,
  columnWidths
}: {
  hourlyForecast: ForecastHour,
  columnWidths: HourlyForecastDetailsColumnWidths,
}) {

  const w = {
    humidity: columnWidths.humidity,
    uvIndex: columnWidths.uvIndex,
  };
  const relativeHumidity = hourlyForecast.relativeHumidity;
  const uvIndex = hourlyForecast.uvIndex;

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "nowrap", ml: 1, whiteSpace: "nowrap" }}>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.humidity, flexShrink: 0 }}>
        <OpacityIcon fontSize="small" />
        <Typography variant="body2">Humidity {fmtPct(relativeHumidity)}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.uvIndex, flexShrink: 0 }}>
        <WbSunnyIcon fontSize="small" />
        <Typography variant="body2">UV Index {uvIndex} of 11</Typography>
      </Stack>

    </Stack>
  );
}

