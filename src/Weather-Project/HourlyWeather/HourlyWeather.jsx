

import React, { useEffect, useState } from "react";
import ClearImg from "../Images/clear.png";
import CloudsImg from "../Images/clouds.png";
import CloudyImg from "../Images/cloudy.png";
import DrizzleImg from "../Images/drizzle.png";
import MistImg from "../Images/mist.png";
import RainyImg from "../Images/rainy-day.png";
import "./HourlyWeather.css";

const API_KEY = "8ad8dc5b7e219e778fc36f6b2543b2b2";

const HourlyWeather = ({ lat, lon }) => {
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (!lat || !lon) {
      setError("Missing location data.");
      setLoading(false);
      return;
    }

    const fetchHourly = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error("Failed to fetch hourly weather");
        const data = await res.json();
        // Take first 12 hours (4 items = 12h interval if API returns 3h each)
        setHourly(data.list.slice(0, 12));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHourly();
  }, [lat, lon]);

  if (loading) return <div className="hourly-loader">Loading hourly...</div>;
  if (error) return <div className="hourly-error">⚠️ {error}</div>;
  if (!hourly.length) return <div className="hourly-empty">No hourly data.</div>;

  return (
    <div className="hourly-container">
      {hourly.map((hour, index) => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return (
          <div key={index} className="hourly-card">
            <div className="hour">{time}</div>
            <img
              className="hourly-icon"
              src={getWeatherIcon(hour.weather[0].main)}
              alt={hour.weather[0].main}
            />
            <div className="hourly-temp">{Math.round(hour.main.temp)}°C</div>
          </div>
        );
      })}
    </div>
  );
};

export default HourlyWeather;
