export async function getCity(city: string) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`);
  return response.json();
}

interface ForecastParams {
  city: string;
  days?: number;
}

export async function getForecast({ city, days = 7 }: ForecastParams) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}`);
  return response.json();
}
