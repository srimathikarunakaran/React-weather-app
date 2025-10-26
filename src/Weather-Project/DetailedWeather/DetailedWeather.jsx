

import React, { useEffect, useState } from "react";
import "./DetailedWeather.css";

const API_KEY = "8ad8dc5b7e219e778fc36f6b2543b2b2";

const DetailedWeather = ({ lat, lon }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) {
      setError("Missing location data.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error("Failed to fetch detailed weather");
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [lat, lon]);

  if (loading) return <div className="details-loader">Loading details...</div>;
  if (error) return <div className="details-error">⚠️ {error}</div>;
  if (!details) return null;

  const sunrise = new Date(details.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(details.sys.sunset * 1000).toLocaleTimeString();

  return (
    <div>
      <div className="title1"><h2>Detail Weather</h2></div>
      <div className="details-card">
      
      <div className="details-grid">
        <div>Feels Like: {Math.round(details.main.feels_like)}°C</div>
        <div>Pressure: {details.main.pressure} hPa</div>
        <div>Visibility: {details.visibility / 1000} km</div>
        <div>Sunrise: {sunrise}</div>
        <div>Sunset: {sunset}</div>
      </div>
    </div>
    </div>
  );
};

export default DetailedWeather;
