export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Temperature {
  day: number;
  night: number;
  eve: number;
  morn: number;
  max: number;
  min: number;
}

export interface CityTableDate {
  name: string;
  lat: number;
  lon: number;
  country?: string
}

export interface CityTableDateDaily  extends CityTableDate {
  daily?: WeatherDailyResponseBody[];
}

export interface CityTableDateHourly extends CityTableDate {
  hourly?: WeatherHourlyResponseBody[];
}

export interface CityResponsBody extends Coordinates {
  name: string;
  local_names: { [key: string]: string };
  country: string;
  state: string;
}

export interface WeatherCityHourlyResponsBody extends Coordinates {
  timezone: string;
  timezone_offset: number;
  hourly: WeatherHourlyResponseBody[];
  minutely: WeatherResponseBody[];
}

export interface WeatherCityDailyResponsBody extends Coordinates {
  timezone: string;
  timezone_offset: number;
  daily: WeatherDailyResponseBody[];
  minutely: WeatherResponseBody[];
}

export interface WeatherResponseBody {
  dt: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[]; // Array<Weather>
  pop: number;
  rain: Precipitation;
}

export interface WeatherDailyResponseBody extends WeatherResponseBody {
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  feels_like: Omit<Temperature, 'max' | 'min'>;
  temp: Temperature;
}

export interface WeatherHourlyResponseBody extends WeatherResponseBody {
  feels_like: number;
  visibility: number;
  temp: number;
}

type PressSet = 'current' | 'minutely' | 'alerts';
export type HourlyPress = PressSet | 'hourly';
export type DayPress = PressSet | 'daily';
export type Precipitation = { [key: string]: number };
