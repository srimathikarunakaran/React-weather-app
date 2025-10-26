import React, { useEffect, useState } from "react";
import ClearImg from "../Images/clear.png";
import CloudsImg from "../Images/clouds.png";
import CloudyImg from "../Images/cloudy.png";
import DrizzleImg from "../Images/drizzle.png";
import MistImg from "../Images/mist.png";
import RainyImg from "../Images/rainy-day.png";
import "./ForcastList.css";

const API_KEY = "8ad8dc5b7e219e778fc36f6b2543b2b2";

const ForecastList = ({ lat, lon }) => {
  const [forecast, setForecast] = useState([]);
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
    // 🛑 Don't fetch until we actually have coordinates
    if (!lat || !lon) {
      setLoading(false);
      return;
    }

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error("Failed to fetch forecast data");

        const data = await res.json();

        // ✅ Group forecast by day (one item per day)
        const dailyData = [];
        const daysAdded = new Set();

        data.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleDateString("en-US", { weekday: "short" });
          if (!daysAdded.has(day)) {
            daysAdded.add(day);
            dailyData.push(item);
          }
        });

        setForecast(dailyData.slice(0, 7));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon]);

  // 💡 UI conditions
  if (loading) return <div className="forecast-loader">Loading forecast...</div>;
  if (error) return <div className="forecast-error">⚠️ {error}</div>;
  if (!forecast.length) return null; // no data yet → show nothing

  return (
    <div>
      <div  className="title">
        <h1>7 days forcast</h1>
      </div>
      <div className="forecast-container">
     
      {forecast.map((day, index) => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const dayDate = date.getDate();

        return (
          <div key={index} className="forecast-card">
            
            <div className="day">{dayName}</div>
            <div className="date">{dayDate}</div>
            <img
              className="forecast-icon"
              src={getWeatherIcon(day.weather[0].main)}
              alt={day.weather[0].main}
            />
            <div className="temp-forcast">{Math.round(day.main.temp)}°C</div>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default ForecastList;
