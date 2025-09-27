import { ForecastHour, TimeOfDay, WeatherCondition } from '../types';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { fmtPct, fmtTempF, toMph } from '../utilities';
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import AirIcon from "@mui/icons-material/Air";
import { WbSunny as SunnyIcon } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Derive a condition label + icon from the forecast.
type ConditionView = {
  label: string;
  iconUrl?: string;                 // from Google
  FallbackIcon: typeof SunnyIcon;   // MUI fallback
};

// ---------- Display helpers (compact, single-line) ----------

function conditionFromForecast(hourlyForecast: ForecastHour): ConditionView {

  const weatherCondition: WeatherCondition | undefined = hourlyForecast.weatherCondition;
  const label = weatherCondition?.description?.text || "—";

  // Google returns a base URI; append .svg (add "_dark" if you want a dark theme variant)
  const iconUrl = weatherCondition?.iconBaseUri ? `${weatherCondition.iconBaseUri}.svg` : undefined;

  return { label, iconUrl, FallbackIcon: SunnyIcon };
}

export default function HourlyForecast({
  hourlyForecast,
  columnWidths,
  open,
  onToggle,
}: {
  hourlyForecast: ForecastHour,
  columnWidths: Partial<{ timeOfDay: number, temp: number; condition: number; precip: number; wind: number; toggle: number }>,
  open: boolean,
  onToggle: () => void,
}) {

  const w = {
    timeOfDay: columnWidths?.timeOfDay ?? 180,
    temp: columnWidths?.temp ?? 72,
    condition: columnWidths?.condition ?? 160,
    precip: columnWidths?.precip ?? 64,
    wind: columnWidths?.wind ?? 88,
    toggle: columnWidths?.toggle ?? 36,
  };

  const temperature = fmtTempF(hourlyForecast.temperature.degrees);
  const precip = hourlyForecast!.precipitation!.probability!.percent;
  const windMph = toMph(hourlyForecast!.wind!.speed!.value);
  const { label, iconUrl, FallbackIcon } = conditionFromForecast(hourlyForecast);

  function formatTimeOfDay(timeOfDay: TimeOfDay): string {
    const date = new Date(
      timeOfDay.year,
      timeOfDay.month - 1, // JS months are 0-based
      timeOfDay.day,
      timeOfDay.hours,
      timeOfDay.minutes,
      timeOfDay.seconds
    );

    // `h:mm A` → 12-hour format and AM/PM
    return dayjs(date).format("h A");
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "nowrap", ml: 1, whiteSpace: "nowrap" }}>

      {/* Time of Day */}
      <Typography
        sx={{ width: w.timeOfDay, minWidth: w.timeOfDay, lineHeight: 1.2, flexShrink: 0, whiteSpace: "nowrap" }}
        color="text.secondary"
      >
        {formatTimeOfDay(hourlyForecast.displayDateTime)}
      </Typography>

      {/* Temperature */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.temp, minWidth: w.temp, flexShrink: 0 }}>
        <Typography variant="body2" fontWeight={700}>
          {temperature}
        </Typography>
      </Stack>

      {/* Condition */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ width: w.condition, minWidth: w.condition, flexShrink: 0, overflow: "hidden" }}
      >
        {iconUrl ? (
          <Box component="img" src={iconUrl} alt={label} sx={{ width: 20, height: 20, display: "block", flexShrink: 0 }} />
        ) : (
          <FallbackIcon fontSize="small" />
        )}
        <Typography variant="body2" noWrap title={label}>
          {label}
        </Typography>
      </Stack>

      {/* Precip */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.precip, minWidth: w.precip, flexShrink: 0 }}>
        <WaterDropOutlinedIcon fontSize="small" />
        <Typography variant="body2">{fmtPct(precip)}</Typography>
      </Stack>

      {/* Wind */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.wind, minWidth: w.wind, flexShrink: 0 }}>
        <AirIcon fontSize="small" />
        <Typography variant="body2">
          {typeof windMph === "number" ? `${windMph} mph` : "—"}
        </Typography>
      </Stack>

      {/* Toggle */}
      <Box sx={{ width: w.toggle, minWidth: w.toggle, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        <IconButton size="small" onClick={onToggle}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>

    </Stack>
  );
}

