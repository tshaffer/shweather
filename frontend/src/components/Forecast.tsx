import {
  Box,
  Stack,
  Collapse,
} from "@mui/material";
import { DailyForecastDay, ForecastHour, ForecastView } from "../types";
import ForecastDetails from "./ForecastDetails";
import DailyForecast from "./DailyForecast";
import { JSX, useState } from "react";
import { useSelector } from "react-redux";
import { selectDailyForecasts, selectForecastView, selectHourlyForecasts } from "../redux";
import HourlyForecast from "./HourlyForecast";

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
    return (
      <Box
        className="rounded-2xl border border-gray-200"
        sx={{ p: 0.75 }}
        key={dailyForecast.displayDate.day}
      >
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ flexWrap: "nowrap" }} key={dailyForecast.displayDate.day}>
          <Box key={dailyForecast.displayDate.day}>
            <DailyForecast
              dailyForecastDay={dailyForecast}
              open={!!openRows[idx]}
              onToggle={() => toggleRow(idx)}
              key={dailyForecast.displayDate.day}
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
          <ForecastDetails dailyForecastDay={dailyForecast} key={dailyForecast.displayDate.day} />
        </Collapse>


      </Box>
    );
  }

  const renderDaysInForecast = (): JSX.Element[] => {
    return forecast.map((dailyForecast, index) => renderDailyForecast(dailyForecast, index));
  }

  const renderHourlyForecast = (hourlyForecast: ForecastHour, idx: number): JSX.Element => {
    return (
      <Box
        className="rounded-2xl border border-gray-200"
        sx={{ p: 0.75 }}
        key={hourlyForecast.displayDateTime.toString()}
      >
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ flexWrap: "nowrap" }} key={hourlyForecast.displayDateTime.toString()}>
          <Box key={hourlyForecast.displayDateTime.toString()}>
            <HourlyForecast
              hourlyForecast={hourlyForecast}
              key={hourlyForecast.displayDateTime.toString()}
              columnWidths={{
                timeOfDay: HOURLY_COLUMNS.timeOfDay,
                temp: HOURLY_COLUMNS.temp,
                condition: HOURLY_COLUMNS.condition,
                precip: HOURLY_COLUMNS.precip,
                wind: HOURLY_COLUMNS.wind,
              }}
            />
          </Box>
        </Stack>
      </Box>
    );
  }

  const renderHoursInForecast = (): JSX.Element[] => {
    return hourlyForecasts.map((hourlyForecast, index) => renderHourlyForecast(hourlyForecast, index));
  }

  let forecastJSX: JSX.Element[] = [];
  if (forecastView === 'daily') {
    forecastJSX = renderDaysInForecast();
  } else {
    forecastJSX = renderHoursInForecast();
  }

  console.log('forecast');
  for (const element of forecast) {
    console.log(element);
  }

  return (
    <div>
      {forecastJSX}
    </div >
  );
}

