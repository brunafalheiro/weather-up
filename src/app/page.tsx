"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getCity, getForecast } from "@/services/api";
import Image from "next/image";

interface WeatherProperties {
  condition: {
    text: string;
    icon: string;
  };
  feelslike_c: string;
  heatindex_c: string;
  humidity: string;
  temp_c: string;
};

interface HourlyWeatherProperties extends WeatherProperties {
  time: string;
}

interface ForecastProperties {
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
  hour: Array<HourlyWeatherProperties>;
};

interface Weather {
  current: WeatherProperties;
  forecast: {
    forecastday: Array<ForecastProperties>;
  };
};

const Home = ()  =>{
  const [time, setTime] = useState<Date | null>(null);
  const [searchedCity, setSearchedCity] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const interval = setInterval(() => { setTime(new Date()) }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchedCity.length < 3) return;
  
    const fetchWeather = async () => {
      const data = await getCity(searchedCity);
      const currentCity = data[0].name;
      setSelectedCity(currentCity);
      const forecast = await getForecast({ city: currentCity });
      setWeather(forecast);
    };
  
    fetchWeather();
  }, [searchedCity]);

  useEffect(() => {
    console.log(weather);
  }, [weather]);

  return (
    <div className="h-screen flex">
      <div className="w-[60vw] h-screen bg-slate-200">
        <div className="flex space-between">
          <Input placeholder="Cidade"
            value={searchedCity}
            onChange={(text) => setSearchedCity(text.target.value)}
            className="w-25"
          />
          <div>{time?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
        </div>
        <div>{selectedCity}</div>

        <div>{time?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        {weather?.current.condition.icon && (
          <div className="flex items-center">
            <Image
              src={`http:${weather.current.condition.icon}`}
              alt=""
              width={120}
              height={120}
            />

            <div>
              <p>{weather?.current.heatindex_c}</p>
              <p>{weather?.current.feelslike_c}</p>
              <p>{weather?.current.condition.text}</p>
              <p>{weather?.current.humidity}</p>
            </div>
          </div>
        )}

        <div className="flex">
          {weather?.forecast.forecastday.map((forecast, index) => (
            <div key={index} className="w-full flex flex-col items-center mr-4">
              <Image
                src={`http:${forecast.day.condition.icon}`}
                alt=""
                width={80}
                height={80}
              />
              <p>{forecast.day.condition.text}</p>
              <p>{forecast.day.avgtemp_c}</p>
              <p>{forecast.day.maxtemp_c}</p>
              <p>{forecast.day.mintemp_c}</p>
              <p>{forecast.day.totalprecip_mm}</p>
              <p>{forecast.day.daily_chance_of_rain}</p>
              <p>{forecast.day.daily_chance_of_snow}</p>                  
            </div>
          ))}
        </div>
      </div>
      <div className="w-[40vw] h-screen bg-slate-100">
        
      </div>
    </div>
  );
};

export default Home;