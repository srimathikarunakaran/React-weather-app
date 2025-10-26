import React, { useState, useEffect } from "react";
import "./CurrentWeather.css";
import ForecastList from "../ForcastList/ForecastList";
import HourlyWeather from "../HourlyWeather/HourlyWeather";

import ClearImg from "../Images/clear.png";
import CloudsImg from "../Images/clouds.png";
import CloudyImg from "../Images/cloudy.png";
import DrizzleImg from "../Images/drizzle.png";
import HumidityImg from "../Images/humidity.png";
import MistImg from "../Images/mist.png";
import RainyImg from "../Images/rainy-day.png";
import SendImg from "../Images/send.png";
import WindImg from "../Images/wind.png";
import DetailedWeather from "../DetailedWeather/DetailedWeather";


const API_KEY = "8ad8dc5b7e219e778fc36f6b2543b2b2";

const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lon: null });

  const fetchWeather = async (queryCity, lat, lon) => {
    setLoading(true);
    setError(false);
    setWeather(null);

    let url = "";
    if (queryCity) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&units=metric&appid=${API_KEY}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    } else {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather({
        city: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        condition: data.weather[0].main,
      });
      setCoords({ lat: data.coord.lat, lon: data.coord.lon });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather automatically on page load using geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(null, pos.coords.latitude, pos.coords.longitude),
        (err) => console.warn("Geolocation blocked:", err)
      );
    }
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clouds": return CloudsImg;
      case "Rain": return RainyImg;
      case "Clear": return ClearImg;
      case "Mist": return MistImg;
      case "Drizzle": return DrizzleImg;
      default: return CloudyImg;
    }
  };

  const displayedTemp = weather ? Math.round(weather.temp) : "";

  return (
    <>
      <div className="Card">
        <div className="search">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather(city)}
          />
          <button onClick={() => fetchWeather(city)}>
            <img src={SendImg} alt="Search" />
          </button>
        </div>

        {error && <div className="error">Invalid City name ❌</div>}
        {loading && <div className="loader">Loading...</div>}

        {weather && !loading && (
          <div className="weather-details-container">
            <div className="left-main-col">
              <div className="left-child-left">
                <img
                  src={getWeatherIcon(weather.condition)}
                  alt={weather.condition}
                  className="weather-icon"
                />
              </div>
              <div className="left-child-right">
                <h1 className="temp">{displayedTemp}°C</h1>
                <span className="condition-text-pill">{weather.condition}</span>
              </div>
            </div>

            <div className="right-main-col">
              <div className="right-child-left">
                <img src={HumidityImg} alt="Humidity" />
                <p className="humidity">Humidity: {weather.humidity}%</p>
              </div>
              <div className="right-child-right">
                <img src={WindImg} alt="Wind" />
                <p className="wind">Wind: {weather.wind} km/h</p>
              </div>
            </div>
          </div>
        )}
      </div>

{coords.lat && coords.lon && (
  <>
    {/* Forecast Section */}
    <div className="forecast-wrapper">
      <ForecastList lat={coords.lat} lon={coords.lon} />
    </div>

    {/* Detailed Weather Section */}
    <DetailedWeather lat={coords.lat} lon={coords.lon} />

    {/* Hourly Weather Section */}
    <div className="hourly-wrapper">
      <HourlyWeather lat={coords.lat} lon={coords.lon} />
    </div>
  </>
)}
    </>
  );
};

export default WeatherCard;
