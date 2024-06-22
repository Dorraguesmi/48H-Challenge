import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import CityInput from "./CityInput.tsx";
import "../App.css";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaWind,
} from "react-icons/fa";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: string;
  cityName: string; 
}

export default function WeatherCard() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeatherData = async (city: string | undefined) => {
      try {
        let latitude, longitude, cityName;

        if (city) {
          const geocodingResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
          );
          const geocodingData = await geocodingResponse.json();
          latitude = geocodingData.results[0].latitude;
          longitude = geocodingData.results[0].longitude;
          cityName = geocodingData.results[0].name;
        } else {
          const position = await getCurrentPosition();
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          cityName = "Current Location"; 
        }
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherResponse.json();
        const currentWeather = weatherData.current_weather;

        setWeather({
          temperature: currentWeather.temperature,
          windSpeed: currentWeather.windspeed,
          weatherCode: currentWeather.weathercode,
          cityName: cityName, 
        });
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeather(null);
        setLoading(false); 
      }
    };

    const getCurrentPosition = () => {
      return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };
    fetchWeatherData(city);
  }, [city]);

  const renderWeatherIcon = (weatherCode: string) => {
    switch (weatherCode) {
      case "clear":
        return <FaSun size={64} color="orange" />;
      case "partly-cloudy":
        return <FaCloud size={64} color="gray" />;
      case "cloudy":
        return <FaCloud size={64} color="darkgray" />;
      case "rain":
        return <FaCloudRain size={64} color="blue" />;
      case "snow":
        return <FaSnowflake size={64} color="lightblue" />;
      default:
        return <FaWind size={64} color="lightgray" />;
    }
  };

  return (
    <div className="weather-container WC">
      <CityInput onCityChange={setCity} />
      {loading ? (
        <p>Loading...</p>
      ) : weather ? (
        <div className="weather-info">
          <div className="weather-icon">
            {renderWeatherIcon(weather.weatherCode)}
          </div>
          <div className="weather-details">
            <p className="weather-detail">City: {weather.cityName}</p>
            <p className="weather-detail">
              Temperature: {weather.temperature} °C
            </p>
            <p className="weather-detail">
              Wind Speed: {weather.windSpeed} km/h
            </p>
          </div>
        </div>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
}
