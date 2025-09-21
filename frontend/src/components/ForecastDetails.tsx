import { DailyForecastDay } from "../types";

const fmtPct = (n?: number) => (typeof n === "number" ? `${n}%` : "—");

export default function ForecastDetails({ dailyForecastDay }: { dailyForecastDay: DailyForecastDay }) {

  console.log('ForecastDetails dailyForecastDay:', dailyForecastDay);
  console.log(dailyForecastDay);
  if (dailyForecastDay) {
    console.log(dailyForecastDay.daytimeForecast);
    if (dailyForecastDay.daytimeForecast) {
      console.log(dailyForecastDay.daytimeForecast.uvIndex);
      console.log(dailyForecastDay.daytimeForecast.cloudCover);
      console.log(dailyForecastDay.daytimeForecast.wind);
      if (dailyForecastDay.daytimeForecast.wind) {
        console.log(dailyForecastDay.daytimeForecast.wind.speed);
      }
    }
  }
  const d = dailyForecastDay?.daytimeForecast;
  const sunrise = dailyForecastDay?.sunEvents?.sunrise;
  const sunset = dailyForecastDay?.sunEvents?.sunset;

  // uv index
  // humidity
  // hourly details
  
  return (
    <>Placeholder details</>
  );
}

