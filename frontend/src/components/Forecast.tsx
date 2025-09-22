import {
  Box,
  Stack,
  Typography,
  Collapse,
} from "@mui/material";
import { DailyForecastDay } from "../types";
import ForecastDetails from "./ForecastDetails";
import DailyForecast from "./DailyForecast";
import { JSX, useState } from "react";
import { useSelector } from "react-redux";
import { selectDailyForecasts } from "../redux";

// near the top of Forecast.tsx
const COL = {
  date: 160,        // your preferred date label width
  temps: 72,
  condition: 180,
  precip: 64,
  wind: 88,
  toggle: 36,       // caret button
};

export default function Forecast() {

  const forecast: DailyForecastDay[] = useSelector(selectDailyForecasts);

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
      >
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ flexWrap: "nowrap" }}>
          <Box key={dailyForecast.displayDate.day}>


            <DailyForecast
              dailyForecastDay={dailyForecast}
              open={!!openRows[idx]}
              onToggle={() => toggleRow(idx)}
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
          <ForecastDetails dailyForecastDay={dailyForecast} />
        </Collapse>


      </Box>
    );
  }

  const renderDaysInForecast = (): JSX.Element[] => {
    return forecast.map((dailyForecast, index) => renderDailyForecast(dailyForecast, index));
  }

  const daysInForecast: JSX.Element[] = renderDaysInForecast();

  return (
    <div>
      {daysInForecast}
    </div >
  );
}
