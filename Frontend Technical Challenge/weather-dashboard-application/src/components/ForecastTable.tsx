import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import DaysInput from "./DaysInput.tsx";
import "../App.css";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaWind,
} from "react-icons/fa";

interface WeatherData {
  temperature: number[];
  windSpeed: number[];
  relativeHumidity: number[];
}

interface ForecastData {
  date: string;
  temperature: number;
  windSpeed: number;
  relativeHumidity: number;
}

export default function ForecastTable() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [daysNumber, setDaysNumber] = useState<number>(10); // Default to 10 days

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );
        const data = await response.json();

        if (data && data.hourly && data.hourly.time.length > 0) {
          const hourlyData = data.hourly;

          // Filter hourly data for up to 10 days
          const forecastData: ForecastData[] = [];
          let currentDate = "";

          for (let i = 0; i < hourlyData.time.length; i++) {
            const date = new Date(hourlyData.time[i]);
            const day = date.toLocaleDateString();

            // Check if a new day is encountered and limit to 10 days
            if (day !== currentDate && forecastData.length < daysNumber) {
              forecastData.push({
                date: day,
                temperature: hourlyData.temperature_2m[i],
                windSpeed: hourlyData.wind_speed_10m[i],
                relativeHumidity: hourlyData.relative_humidity_2m[i],
              });
              currentDate = day;
            }
          }

          setWeather({
            temperature: hourlyData.temperature_2m,
            windSpeed: hourlyData.wind_speed_10m,
            relativeHumidity: hourlyData.relative_humidity_2m,
          });

          setForecast(forecastData);
          setLoading(false);
        } else {
          setLoading(false);
          console.error("No weather data available.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [daysNumber]);

  const renderWeatherIcon = (weatherCode: string) => {
    switch (weatherCode) {
      case "clear":
        return <FaSun size={24} color="orange" />;
      case "partly-cloudy":
        return <FaCloud size={24} color="gray" />;
      case "cloudy":
        return <FaCloud size={24} color="darkgray" />;
      case "rain":
        return <FaCloudRain size={24} color="blue" />;
      case "snow":
        return <FaSnowflake size={24} color="lightblue" />;
      default:
        return <FaWind size={24} color="lightgray" />;
    }
  };

  const handleDaysChange = (days: string) => {
    const daysNumber = parseInt(days);
    setDaysNumber(daysNumber);
  };

  return (
    <div className="weather-container WC1">
      <DaysInput onDaysChange={handleDaysChange} />
      {loading ? (
        <p>Loading...</p>
      ) : weather && forecast.length > 0 ? (
        <div className="forecast-table">
          <h2>Weather Forecast for the Next {daysNumber} Days</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weather</th>
                <th>Temperature (°C)</th>
                <th>Wind Speed (m/s)</th>
                <th>Relative Humidity (%)</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((day, index) => (
                <tr key={index}>
                  <td>{day.date}</td>
                  <td>{renderWeatherIcon("clear")}</td>
                  <td>{day.temperature.toFixed(1)}</td>
                  <td>{day.windSpeed.toFixed(1)}</td>
                  <td>{day.relativeHumidity.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
}
