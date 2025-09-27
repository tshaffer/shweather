import {
  Box,
  Stack,
  Collapse,
} from "@mui/material";
import { DailyForecastDay, ForecastHour, ForecastView, TimeOfDay } from "../types";
import ForecastDetails from "./ForecastDetails";
import DailyForecast from "./DailyForecast";
import { JSX, useState } from "react";
import { useSelector } from "react-redux";
import { selectDailyForecasts, selectForecastView, selectHourlyForecasts } from "../redux";
import HourlyForecast from "./HourlyForecast";
import HourlyForecastDetails from "./HourlyForecastDetails";

// near the top of Forecast.tsx
const COL = {
  date: 160,
  temps: 72,
  condition: 180,
  precip: 64,
  wind: 88,
  toggle: 36,
};

const HOURLY_COLUMNS = {
  timeOfDay: 160,
  temp: 72,
  condition: 180,
  precip: 64,
  wind: 88,
};

export default function Forecast() {

  const forecastView: ForecastView = useSelector(selectForecastView);

  const forecast: DailyForecastDay[] = useSelector(selectDailyForecasts);
  const hourlyForecasts: ForecastHour[] = useSelector(selectHourlyForecasts);

  const [openRows, setOpenRows] = useState<boolean[]>([]);
  const toggleRow = (i: number) =>
    setOpenRows((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });


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
                date: COL.date,
                temps: COL.temps,
                condition: COL.condition,
                precip: COL.precip,
                wind: COL.wind,
                toggle: COL.toggle,
              }}
            />
          </Box>
        </Stack>

        <Collapse in={!!openRows[idx]} timeout="auto" unmountOnExit>
          <ForecastDetails dailyForecastDay={dailyForecast} key={dailyKey} />
        </Collapse>


      </Box>
    );
  }

  function toDate(timeOfDay: TimeOfDay): Date {
    return new Date(
      timeOfDay.year,
      timeOfDay.month - 1, // JS months are 0-based
      timeOfDay.day,
      timeOfDay.hours,
      timeOfDay.minutes,
      timeOfDay.seconds,
      Math.floor((timeOfDay.nanos ?? 0) / 1_000_000) // nanos → ms
    );
  }

  const renderHourlyForecast = (hourlyForecast: ForecastHour, idx: number): JSX.Element => {

    const hourKey = toDate(hourlyForecast.displayDateTime).toISOString();

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
                toggle: COL.toggle,

              }}
            />
          </Box>
        </Stack>

        <Collapse in={!!openRows[idx]} timeout="auto" unmountOnExit>
          <HourlyForecastDetails hourlyForecast={hourlyForecast} key={hourKey} />
        </Collapse>
      </Box>
    );
  }

  const renderDaysInForecast = (): JSX.Element[] => {
    return forecast.map((dailyForecast, index) => renderDailyForecast(dailyForecast, index));
  }

  const renderHoursInForecast = (): JSX.Element[] => {
    return hourlyForecasts.map((hourlyForecast, index) => renderHourlyForecast(hourlyForecast, index));
  }

  console.log('Forecast render', forecastView);

  let forecastJSX: JSX.Element[] = [];

  console.log('forecastJSX length before:', forecastJSX.length);
  if (forecastView === 'daily') {
    forecastJSX = renderDaysInForecast();
  } else {
    forecastJSX = renderHoursInForecast();
  }
  console.log('forecastJSX length after:', forecastJSX.length);

  // at the bottom of Forecast.tsx
  return (
    <Box>
      {forecastJSX}
    </Box>
  );
}

