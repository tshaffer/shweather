import { JSX, useState } from "react";
import { useSelector } from "react-redux";
import {
  Backdrop, CircularProgress,
  Box,
  Stack,
  Collapse,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { DailyForecastDay, ForecastHour, ForecastView, TimeOfDay } from "../types";
import DailyForecastDetails from "./DailyForecastDetails";
import DailyForecast from "./DailyForecast";
import { selectDailyForecasts, selectForecastView, selectHourlyForecasts, selectIsLoadingForecast } from "../redux";
import HourlyForecast from "./HourlyForecast";
import HourlyForecastDetails from "./HourlyForecastDetails";
import { timeOfDayToDate } from "../utilities";

const DAILY_COLUMNS = {
  date: 160,
  temps: 72,
  condition: 180,
  precip: 64,
  wind: 88,
  toggle: 36,
};

const DAILY_DETAILED_COLUMNS = {
  humidity: 180,
  uvIndex: 180,
  sunrise: 160,
  sunset: 64,
};

const HOURLY_COLUMNS = {
  timeOfDay: 160,
  temp: 72,
  condition: 180,
  precip: 64,
  wind: 88,
};

const HOURLY_DETAILED_COLUMNS = {
  humidity: 180,
  uvIndex: 180,
};

export default function Forecast() {

  const forecastView: ForecastView = useSelector(selectForecastView);

  const forecast: DailyForecastDay[] = useSelector(selectDailyForecasts);
  const hourlyForecasts: ForecastHour[] = useSelector(selectHourlyForecasts);
  const loading: boolean = useSelector(selectIsLoadingForecast);

  const [openRows, setOpenRows] = useState<boolean[]>([]);
  const toggleRow = (i: number) =>
    setOpenRows((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function dayHeaderLabel(d: Date): string {
    // "Wednesday, Oct 8"
    return dayjs(d).format("dddd, MMM D");
  }

  function dayKey(d: Date): string {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  const renderDailyForecast = (dailyForecast: DailyForecastDay, idx: number): JSX.Element => {

    const dailyKey = `${dailyForecast.displayDate.year}-${dailyForecast.displayDate.month}-${dailyForecast.displayDate.day}`;

    return (
      <Box
        className="rounded-2xl border border-gray-200"
        sx={{ p: 0.75 }}
        key={dailyKey}
      >
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ flexWrap: "nowrap" }} key={dailyKey}>
          <Box key={dailyKey}>
            <DailyForecast
              dailyForecastDay={dailyForecast}
              open={!!openRows[idx]}
              onToggle={() => toggleRow(idx)}
              key={dailyKey}
              columnWidths={{
                date: DAILY_COLUMNS.date,
                temps: DAILY_COLUMNS.temps,
                condition: DAILY_COLUMNS.condition,
                precip: DAILY_COLUMNS.precip,
                wind: DAILY_COLUMNS.wind,
                toggle: DAILY_COLUMNS.toggle,
              }}
            />
          </Box>
        </Stack>

        <Collapse in={!!openRows[idx]} timeout="auto" unmountOnExit>
          <DailyForecastDetails
            dailyForecastDay={dailyForecast}
            key={dailyKey}
            columnWidths={{
              humidity: DAILY_DETAILED_COLUMNS.humidity,
              uvIndex: DAILY_DETAILED_COLUMNS.uvIndex,
              sunrise: DAILY_DETAILED_COLUMNS.sunrise,
              sunset: DAILY_DETAILED_COLUMNS.sunset,
            }}
          />
        </Collapse>


      </Box>
    );
  }

  const renderHourlyForecast = (hourlyForecast: ForecastHour, idx: number): JSX.Element => {

    const hourKey = timeOfDayToDate(hourlyForecast.displayDateTime).toISOString();

    return (
      <Box
        className="rounded-2xl border border-gray-200"
        sx={{ p: 0.75 }}
        key={hourKey}
      >
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ flexWrap: "nowrap" }} key={hourKey}>
          <Box key={hourKey}>
            <HourlyForecast
              hourlyForecast={hourlyForecast}
              key={hourKey}
              open={!!openRows[idx]}
              onToggle={() => toggleRow(idx)}
              columnWidths={{
                timeOfDay: HOURLY_COLUMNS.timeOfDay,
                temp: HOURLY_COLUMNS.temp,
                condition: HOURLY_COLUMNS.condition,
                precip: HOURLY_COLUMNS.precip,
                wind: HOURLY_COLUMNS.wind,
                toggle: DAILY_COLUMNS.toggle,

              }}
            />
          </Box>
        </Stack>

        <Collapse in={!!openRows[idx]} timeout="auto" unmountOnExit>
          <HourlyForecastDetails
            hourlyForecast={hourlyForecast}
            key={hourKey}
            columnWidths={{
              humidity: HOURLY_DETAILED_COLUMNS.humidity,
              uvIndex: HOURLY_DETAILED_COLUMNS.uvIndex,
            }}
          />
        </Collapse>
      </Box>
    );
  }

  const renderDaysInForecast = (): JSX.Element[] => {
    return forecast.map((dailyForecast, index) => renderDailyForecast(dailyForecast, index));
  }

  const renderHoursInForecast = (): JSX.Element[] => {
    const out: JSX.Element[] = [];

    for (let i = 0; i < hourlyForecasts.length; i++) {
      const hf = hourlyForecasts[i];
      const curr = timeOfDayToDate(hf.displayDateTime);

      const needHeader =
        i === 0 ||
        !isSameDay(curr, timeOfDayToDate(hourlyForecasts[i - 1].displayDateTime));

      if (needHeader) {
        out.push(
          <Box
            key={`hdr-${dayKey(curr)}`}
            sx={{
              px: 1,
              pt: i === 0 ? 0 : 1.25, // a bit more space when starting a new day
              pb: 0.5,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {dayHeaderLabel(curr)}
            </Typography>
          </Box>
        );
      }

      out.push(renderHourlyForecast(hf, i));
    }

    return out;
  };

  let forecastJSX: JSX.Element[] = [];

  if (forecastView === 'daily') {
    forecastJSX = renderDaysInForecast();
  } else {
    forecastJSX = renderHoursInForecast();
  }

  // at the bottom of Forecast.tsx
  return (
    <Box position="relative">
      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <CircularProgress />
      </Backdrop>

      {forecastJSX}
    </Box>
  );
}

