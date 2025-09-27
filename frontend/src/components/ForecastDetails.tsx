import { DailyForecastDay, ForecastDayPart } from "../types";

const fmtPct = (n?: number) => (typeof n === "number" ? `${n}%` : "—");

/*
Humidity - day time
UV Index
Sunrise
Sunset
*/
export default function ForecastDetails({ dailyForecastDay }: { dailyForecastDay: DailyForecastDay }) {

  console.log('ForecastDetails dailyForecastDay:', dailyForecastDay);
  if (dailyForecastDay) {
    if (dailyForecastDay.daytimeForecast) {
      console.log('Daytime forecast:', dailyForecastDay.daytimeForecast);
      const daytimeForecast: ForecastDayPart = dailyForecastDay.daytimeForecast;
      console.log('uvIndex:', daytimeForecast.uvIndex);
      console.log('relativeHumidity:', daytimeForecast.relativeHumidity);
    }
    const sunrise = dailyForecastDay.sunEvents?.sunriseTime;
    console.log('sunrise:', sunrise);
    const sunset = dailyForecastDay.sunEvents?.sunsetTime;
    console.log('sunset:', sunset);
  }

  // uv index
  // humidity
  // hourly details

  return (
    <>Placeholder details</>
  );
}

