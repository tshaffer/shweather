import { ForecastHour } from "../types";

const fmtPct = (n?: number) => (typeof n === "number" ? `${n}%` : "—");

/*`
Humidity - day time
UV Index
Sunrise
Sunset
*/
export default function HourlyForecastDetails({ hourlyForecast }: { hourlyForecast: ForecastHour }) {

  console.log('HourlyForecastDetails hourlyForecast:', hourlyForecast);
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
    <>Placeholder details</>
  );
}

