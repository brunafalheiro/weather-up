export interface WeatherProperties {
  condition: {
    text: string;
    icon: string;
  };
  feelslike_c: string;
  heatindex_c: string;
  temp_c: string;
};

export interface HourlyWeatherProperties extends WeatherProperties {
  time: string;
}

export interface ForecastProperties {
  day: {
    condition: {
      icon: string;
      text: string;
    };
    avgtemp_c: string;
    maxtemp_c: string;
    mintemp_c: string;
    totalprecip_mm: string;
    daily_chance_of_rain: string;
    daily_chance_of_snow: string;
  };
  date: string;
  hour: Array<HourlyWeatherProperties>;
};

export interface Weather {
  current: WeatherProperties;
  forecast: {
    forecastday: Array<ForecastProperties>;
  };
  location: {
    tz_id: string;
  }
};
