import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';

import { DailyForecastDay } from "../types";
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

const fmtPct = (n?: number) => (typeof n === "number" ? `${n}%` : "—");

function formatTimeOfDay(isoString: string): string {
  return dayjs(isoString).format("h:mm a");
}

export default function ForecastDetails({ dailyForecastDay }: { dailyForecastDay: DailyForecastDay }) {

  const relativeHumidity: string = dailyForecastDay.daytimeForecast?.relativeHumidity !== undefined
    ? fmtPct(dailyForecastDay.daytimeForecast.relativeHumidity)
    : '';

  const uvIndex: string = dailyForecastDay.daytimeForecast?.uvIndex !== undefined
    ? `${dailyForecastDay.daytimeForecast.uvIndex} of 11`
    : '';

  const sunrise: string = dailyForecastDay.sunEvents?.sunriseTime !== undefined
    ? `${formatTimeOfDay(dailyForecastDay.sunEvents.sunriseTime)}`
    : '';

  const sunset: string = dailyForecastDay.sunEvents?.sunsetTime !== undefined
    ? `${formatTimeOfDay(dailyForecastDay.sunEvents.sunsetTime)}`
    : '';

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "nowrap", ml: 1, whiteSpace: "nowrap" }}>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: 150, flexShrink: 0 }}>
        <OpacityIcon fontSize="small" />
        <Typography variant="body2">Humidity {relativeHumidity}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: 150, flexShrink: 0 }}>
        <WbSunnyIcon fontSize="small" />
        <Typography variant="body2">UV Index {uvIndex}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: 150, flexShrink: 0 }}>
        <WbSunnyIcon fontSize="small" />
        <Typography variant="body2">Sunrise {sunrise}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: 150, flexShrink: 0 }}>
        <WbTwilightIcon fontSize="small" />
        <Typography variant="body2">Sunset {sunset}</Typography>
      </Stack>

    </Stack>
  );
}

