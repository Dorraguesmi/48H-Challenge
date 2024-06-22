import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

interface WeatherChartProps {
  cityName: string;
}

interface WeatherData {
  hourlyTemperatures: number[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ cityName }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const geocodingResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
        );
        if (!geocodingResponse.ok) {
          throw new Error("Failed to fetch geocoding data");
        }
        const geocodingData = await geocodingResponse.json();
        if (!geocodingData.results || geocodingData.results.length === 0) {
          throw new Error("No geocoding results found");
        }
        const latitude = geocodingData.results[0].latitude;
        const longitude = geocodingData.results[0].longitude;

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
        );
        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const weatherData = await weatherResponse.json();
        if (!weatherData.hourly || !weatherData.hourly.temperature_2m) {
          throw new Error("No weather data found");
        }
        const hourlyTemperatures = weatherData.hourly.temperature_2m.slice(
          0,
          24
        );

        setWeatherData({ hourlyTemperatures });
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching weather data:", error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    if (cityName) {
      fetchWeatherData();
    }
  }, [cityName]);

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Hourly Temperature (°C)",
        data: weatherData?.hourlyTemperatures || [],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div className="weather-chart">
      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : weatherData ? (
        <Line data={chartData} />
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
};

export default WeatherChart;
