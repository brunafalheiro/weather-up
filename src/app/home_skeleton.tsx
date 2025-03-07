import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Weather } from "@/interfaces/weather/weather";
import Image from "next/image";
import moment from "moment";

interface HomeSkeletonProps {
  searchedCity: string;
  weather?: Weather | null;
  selectedDay: number;
}

const HomeSkeleton: React.FC<HomeSkeletonProps> = ({ searchedCity, weather, selectedDay }) => {
  return (
    <div className="h-screen flex">
      <div className="w-full h-screen flex flex-col justify-between bg-slate-200 p-24">
        <div className="flex justify-between">
            <Input placeholder="Cidade"
              value={searchedCity}
              disabled={true}
              className="w-25"
            />
          <Skeleton className="h-4 w-[220px]"/>
        </div>


        <div className="flex items-center justify-center">
          <Skeleton className="h-20 w-[420px] mr-24"/>
          <div>
            <Skeleton className="h-4 w-[120px] mb-2"/>
            <Skeleton className="h-12 w-[220px] mb-2"/>
            <Skeleton className="h-4 w-[120px]"/>
          </div>
        </div>


        <div className="flex items-center justify-center">
          { weather ? (
            weather?.forecast.forecastday.map((forecast, index) => (
              <div
                key={index}
                className={`w-28 h-full flex flex-col items-center ${selectedDay === index ? 'border border-black border-gray-600 rounded-xl' : ''} p-4 mr-8`}
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
            ))
          ) : (
            Array.from({ length: 7 }, (_, index) => (
              <Skeleton key={index} className="h-28 w-28 mr-8"/>
            ))
          )}
        </div>
      </div>
      
      <div className="max-w-[420px] w-full h-screen bg-slate-100 p-24 overflow-y-auto">
        {weather ? (
          moment(weather?.forecast.forecastday[selectedDay].date).isSame(moment(), 'day') 
            ? <p className="text-sm text-end font-semibold">{`Today's prediction`}</p>
            : <p className="text-sm text-end font-semibold">{moment(weather?.forecast.forecastday[selectedDay].date).format('dddd')}</p>
          ) : (
            <Skeleton className="h-4 w-[60px] mb-3"/>
          )
        }
        
        <div className="flex flex-col items-end mt-16 mb-16">
          <Skeleton className="h-4 w-[120px] mb-3"/>
          <Skeleton className="h-4 w-[120px] mb-3"/>
          <Skeleton className="h-4 w-[220px] mb-3"/>
          <Skeleton className="h-4 w-[220px]"/>
        </div>

        <div className="flex flex-col justify-center">
          <Skeleton className="h-4 w-[220px] mb-8"/>
          <Skeleton className="h-4 w-[220px] mb-8"/>
          <Skeleton className="h-4 w-[220px] mb-8"/>
          <Skeleton className="h-4 w-[220px] mb-8"/>
          <Skeleton className="h-4 w-[220px] mb-8"/>
          <Skeleton className="h-4 w-[220px] mb-8"/>
          <Skeleton className="h-4 w-[220px]"/>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
