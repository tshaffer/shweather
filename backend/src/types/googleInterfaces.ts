export type Temperature = { degrees: number; unit: string };

export interface ForecastDayPart {
  interval?: { startTime: string; endTime: string }; // *
  weatherCondition?: { description: string, type: string }; // *
  precipitation?: {
    probability?: number;
    qpf?: any;
    snowQpf?: any;
  };  // *
  wind?: { speed: { value: number; unit: string }; direction?: { degrees: number; localizedDescription?: string } }; // *
  relativeHumidity?: number; // *
  uvIndex?: number; // *
  thunderstormProbability?: number;  // *
  cloudCover?: number; // *
  iceThickness?: { thickness: number; unit: string }; // 1
}

export interface ForecastDay {
  daytimeForecast?: ForecastDayPart; // 0
  displayDate: { year: number; month: number; day: number }; // 1
  feelsLikeMaxTemperature?: Temperature; // 2
  feelsLikeMinTemperature?: Temperature; // 3
  iceThickness?: { thickness: number; unit: string }; // 1
  interval?: { startTime: string; endTime: string }; // 4
  maxHeatIndex?: Temperature; // 5
  maxTemperature?: Temperature;
  minTemperature?: Temperature;
  moonEvents?: {
    moonPhase?: string;
    moonriseTimes?: string[];
    moonsetTimes?: string[];
  };
  nighttimeForecast?: ForecastDayPart;
  sunEvents?: {
    sunrise?: string;
    sunset?: string;
  };
}

export interface ForecastDaysResponse {
  forecastDays: ForecastDay[];
  timeZone?: { id: string };
  nextPageToken?: string;
}

export interface ForecastHoursResponse {
  forecastHours: ForecastHour[];
  timeZone?: { id: string };
  nextPageToken?: string;
}


export interface WeatherConditionDescription {
  text: string;
  languageCode: string;
}

export interface PrecipitationProbability {
  type: string;
  percent: number;
}

export interface ForecastHour {
  interval: { startTime: string; endTime: string };
  displayDateTime: { year: number; month: number; day: number, hours: number; minutes: number; seconds: number; nanos?: number; utcOffset?: string };
  weatherCondition: { description: WeatherConditionDescription; type: string; iconBaseUri?: string };
  temperature: Temperature;
  feelsLikeTemperature: Temperature;
  dewPoint: Temperature;
  heatIndex: Temperature;
  windChill: Temperature;
  wetBulbTemperature?: Temperature;
  precipitation?: {
    probability?: PrecipitationProbability;
    qpf?: any;
    snowQpf?: any;
  };
  airPressure: any;
  wind?: { speed: { value: number; unit: string }; direction?: { degrees: number; localizedDescription?: string } };
  visibility?: { unit: string; distance: number };
  iceThickness?: { thickness: number; unit: string };
  isDaytime: boolean;
  relativeHumidity: number;
  uvIndex: number;
  thunderstormProbability: number;
  cloudCover: number;
}

