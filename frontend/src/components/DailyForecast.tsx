import {
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import AirIcon from "@mui/icons-material/Air";
import { ConditionView, DailyForecastColumnWidths, DailyForecastDay, WeatherCondition } from "../types";
import { fmtPct, fmtTempF, toMph } from "../utilities";
import { WbSunny as SunnyIcon } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import dayjs from "dayjs";

// Derive a condition label + icon from the forecast.

// ---------- Display helpers (compact, single-line) ----------

function conditionFromForecast(dailyForecastDay: DailyForecastDay): ConditionView {

  const weatherCondition: WeatherCondition | undefined = dailyForecastDay.daytimeForecast?.weatherCondition;
  const label = weatherCondition?.description?.text || "—";

  // Google returns a base URI; append .svg (add "_dark" if you want a dark theme variant)
  const iconUrl = weatherCondition?.iconBaseUri ? `${weatherCondition.iconBaseUri}.svg` : undefined;

  return { label, iconUrl, FallbackIcon: SunnyIcon };
}

export default function DailyForecast({
  dailyForecastDay, open, onToggle,
  columnWidths,
}: {
  dailyForecastDay: DailyForecastDay,
  open: boolean,
  onToggle: () => void,
  columnWidths: DailyForecastColumnWidths
}) {

  const w = {
    date: columnWidths.date,
    temps: columnWidths.temps,
    condition: columnWidths.condition,
    precip: columnWidths.precip,
    wind: columnWidths.wind,
    toggle: columnWidths.toggle,
  };

  const daytimeForecast = dailyForecastDay.daytimeForecast;
  const precip = daytimeForecast?.precipitation?.probability?.percent;
  const windMph = toMph(daytimeForecast?.wind?.speed?.value);

  // Hi/Lo (display F, source values assumed °C)
  const hi = fmtTempF(dailyForecastDay.maxTemperature?.degrees); // High first
  const lo = fmtTempF(dailyForecastDay.minTemperature?.degrees); // then Low

  const { label, iconUrl, FallbackIcon } = conditionFromForecast(dailyForecastDay);

  function formatDisplayDate(d: { year: number; month: number; day: number }): string {
    // Note: month - 1 because JS Date constructor expects 0–11
    return dayjs(new Date(d.year, d.month - 1, d.day)).format("ddd MMM D");
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "nowrap", ml: 1, whiteSpace: "nowrap" }}>

      <Typography
        sx={{ width: w.date, minWidth: w.date, lineHeight: 1.2, flexShrink: 0, whiteSpace: "nowrap" }}
        color="text.secondary"
      >
        {formatDisplayDate(dailyForecastDay.displayDate)}
      </Typography>

      {/* Hi/Lo */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: w.temps, minWidth: w.temps, flexShrink: 0 }}>
        <Typography variant="body2" fontWeight={700}>
          {hi}/{lo}
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
        <IconButton size="small" onClick={onToggle} aria-label={open ? "Collapse details" : "Expand details"}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>
    </Stack>
  );

}
