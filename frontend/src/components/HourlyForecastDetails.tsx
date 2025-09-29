import { ForecastHour } from "../types";

// humidity
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

// uv index
import FlareIcon from '@mui/icons-material/Flare';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { Stack, Typography } from "@mui/material";

// Examples
{/* <FlareIcon fontSize="small" /> */ }
{/* <OpacityIcon fontSize="small" />
<WaterDropIcon fontSize="small" /> */}

const fmtPct = (n?: number) => (typeof n === "number" ? `${n}%` : "—");

/*`
Humidity - day time
UV Index
Sunrise
Sunset
*/
export default function HourlyForecastDetails({ hourlyForecast }: { hourlyForecast: ForecastHour }) {

  console.log('HourlyForecastDetails hourlyForecast:', hourlyForecast);

  const relativeHumidity = hourlyForecast.relativeHumidity;
  const uvIndex = hourlyForecast.uvIndex;
  // if (hourlyForecast) {
  //   if (hourlyForecast.daytimeForecast) {
  //     console.log('Daytime forecast:', hourlyForecast.daytimeForecast);
  //     const daytimeForecast: ForecastDayPart = hourlyForecast.daytimeForecast;
  //     console.log('uvIndex:', daytimeForecast.uvIndex);
  //     console.log('relativeHumidity:', daytimeForecast.relativeHumidity);
  //   }
  //   const sunrise = hourlyForecast.sunEvents?.sunriseTime;
  //   console.log('sunrise:', sunrise);
  //   const sunset = hourlyForecast.sunEvents?.sunsetTime;
  //   console.log('sunset:', sunset);
  // }

  // uv index
  // humidity
  // hourly details

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

