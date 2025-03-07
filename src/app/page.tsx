"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getCity, getForecast } from "@/services/api";
import { Weather } from "@/interfaces/weather/weather";
import { Moment } from "moment-timezone";
import HomeSkeleton from "./home_skeleton";
import moment from "moment-timezone";
import Image from "next/image";

const Home = ()  =>{
  const [time, setTime] = useState<Moment>(moment().tz("America/Sao_Paulo"));
  const [searchedCity, setSearchedCity] = useState<string>("Sao Paulo");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [timezone, setTimezone] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timezone) {
        setTime(moment().tz(timezone));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  useEffect(() => {
    if (searchedCity.length < 3) return;

    setIsLoading(true);
  
    const fetchWeather = async () => {
      const data = await getCity(searchedCity);
      const currentCity = data[0].name;
      const forecast = await getForecast({ city: currentCity });
      setWeather(forecast);
      setTimezone(forecast.location.tz_id);
      setSelectedDay(0);
    };
  
    fetchWeather();
  }, [searchedCity]);

  useEffect(() => {
    setInterval(() => { setIsLoading(false) }, 2500);
  }, [selectedDay]);

  if (isLoading) return <HomeSkeleton searchedCity={searchedCity} weather={weather} selectedDay={selectedDay}/>;
  return (
    <div className="h-screen flex">
      <div className="w-full h-screen flex flex-col justify-between bg-slate-200 p-24">
        <div className="h-full flex flex-col justify-between">
          <div className="flex justify-between mb-24">
            <Input placeholder="Cidade"
              value={searchedCity}
              onChange={(text) => setSearchedCity(text.target.value)}
              className="w-25"
            />
            <p className="text-sm font-semibold">{time && time?.format('MM-DD-YYYY')}</p>
          </div>

          {weather?.current.condition.icon && (
            <div className="flex items-center justify-center mb-36">
              <div className="flex relative mr-24">
                  {selectedDay === 0 ? (
                    <p className="relative z-10 text-9xl font-bold">{weather?.current.heatindex_c}</p>
                  ) : (
                    <p className="relative z-10 text-9xl font-bold">{weather?.forecast.forecastday[selectedDay].day.avgtemp_c}</p>
                  )}
                <div className="relative">
                  <p className="relative z-20 text-9xl font-bold">°</p>
                  <div className="absolute inset-[-24px] top-[-6px] rounded-full w-24 h-24 bg-gray-300"></div>
                </div>
              </div>
              
              <div>
                <p className="text-lg text-gray-700 mb-2">{time && time.format('HH:mm')}</p>
                <p className="text-5xl font-bold mb-4">{moment(weather?.forecast.forecastday[selectedDay].date).format('dddd')}</p>
                <p className="text-lg text-gray-700">
                  {selectedDay === 0 ? (
                    weather?.current.condition.text
                  ) : (
                    weather?.forecast.forecastday[selectedDay].day.condition.text
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center">
            {weather?.forecast.forecastday.map((forecast, index) => (
              <div
                key={index}
                className={`w-28 h-full flex flex-col items-center ${selectedDay === index ? 'border border-black border-gray-600 rounded-xl' : ''} cursor-pointer p-4 mr-8`}
                onClick={() => setSelectedDay(index)}
              > 
                <Image
                  src={`http:${forecast.day.condition.icon}`}
                  alt=""
                  className="mb-2"
                  width={32}
                  height={32}
                />
                <p className="font-medium text-gray-600">{moment(forecast.date).format('ddd')}</p>
                <p className="font-medium">{forecast.day.avgtemp_c}°</p>             
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-[420px] w-full h-screen bg-slate-100 p-24 overflow-y-auto">
        <p className="text-sm text-end font-semibold">
          {moment(weather?.forecast.forecastday[selectedDay].date).isSame(moment(), 'day') 
            ? "Today's" 
            : moment(weather?.forecast.forecastday[selectedDay].date).format('dddd')
          } forecast
        </p>

        <div className="mt-16 mb-16">
          <div className="flex justify-end mb-2">
            <p className="uppercase text-gray-400 mr-4">Max</p>
            <p className="w-10 font-semibold text-gray-600">{weather?.forecast.forecastday[selectedDay].day.maxtemp_c}°</p>
          </div>
          <div className="flex justify-end mb-2">
            <p className="uppercase text-gray-400 mr-4">Low</p>
            <p className="w-10 font-semibold text-gray-600">{weather?.forecast.forecastday[selectedDay].day.mintemp_c}°</p>
          </div>
          <div className="flex justify-end mb-2">
            <p className="uppercase text-gray-400 mr-4">Chance of rain</p>
            <p className="w-10 font-semibold text-gray-600">{weather?.forecast.forecastday[selectedDay].day.daily_chance_of_rain}%</p>
          </div>
          <div className="flex justify-end">
            <p className="uppercase text-gray-400 mr-4">Chance of snow</p>
            <p className="w-10 font-semibold text-gray-600">{weather?.forecast.forecastday[selectedDay].day.daily_chance_of_snow}%</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {weather?.forecast.forecastday[selectedDay].hour
            .filter(hour => selectedDay === 0 ? new Date(hour.time).getHours() > time?.hour() : true)
            .map((hour, index) => (
              <div key={index} className="flex justify-end mb-8">
                <p className="text-xl text-gray-600 mr-12">
                  {moment(hour.time).format('HH:mm')}
                </p>
                <p className="text-xl font-bold w-12">{hour.heatindex_c}°</p>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
