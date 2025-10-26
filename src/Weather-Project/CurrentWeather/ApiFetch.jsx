import React, { useState, useEffect } from "react";
import CurrentWeather from "./CurrentWeather";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("London"); // default city

  const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        const formattedData = {
          city: data.name,
          country: data.sys.country,
          temp: data.main.temp,
          weather: data.weather[0].main,
          humidity: data.main.humidity,
          wind: data.wind.speed,
        };
        setWeather(formattedData);
      } catch (err) {
        console.log("Error fetching weather:", err);
      }
    };

    fetchWeather();
  }, [city]);

  return <CurrentWeather data={weather} />;
};

export default Weather;
