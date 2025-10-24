import { useState, useEffect } from 'react';
import { CloudRain, Sun, CloudSnow, Wind } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { weatherApi } from './api';
import { WeatherForecast } from './types';

function Weather() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      setLoading(true);
      const data = await weatherApi.getWeatherForecast();
      setForecasts(data);
    } catch (error) {
      toast.error('Failed to load weather forecast');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (summary: string) => {
    const lowerSummary = summary.toLowerCase();
    if (lowerSummary.includes('freezing') || lowerSummary.includes('chilly') || lowerSummary.includes('cold')) {
      return <CloudSnow className="w-8 h-8 text-blue-400" />;
    } else if (lowerSummary.includes('rain') || lowerSummary.includes('shower')) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    } else if (lowerSummary.includes('wind') || lowerSummary.includes('breezy')) {
      return <Wind className="w-8 h-8 text-gray-500" />;
    } else {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-sky-600 p-3 rounded-xl">
          <CloudRain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
            Weather Forecast
          </h2>
          <p className="text-gray-600 text-sm">5-day forecast</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading weather...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecasts.map((forecast, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 border border-blue-100 hover:shadow-lg transition-shadow"
            >
              <p className="text-sm font-medium text-gray-600 mb-2">
                {formatDate(forecast.date)}
              </p>
              <div className="flex justify-center mb-3">
                {getWeatherIcon(forecast.summary)}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {forecast.temperatureC}°C
                </p>
                <p className="text-sm text-gray-500">
                  {forecast.temperatureF}°F
                </p>
                <p className="text-sm font-medium text-gray-700 mt-2">
                  {forecast.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Weather;
