// src/Weather-Project/ForcastList/forecastAPI.js
const API_KEY = "8ad8dc5b7e219e778fc36f6b2543b2b2";

// This uses the 5-day forecast endpoint and filters 1 reading per day
export const fetchForecastData = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch forecast data");

  const data = await res.json();

  // Group forecast by day (get one sample per day)
  const dailyData = [];
  const addedDays = new Set();

  for (let item of data.list) {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    if (!addedDays.has(dayName)) {
      addedDays.add(dayName);
      dailyData.push(item);
    }
  }

  return dailyData.slice(0, 7); // only 7 days
};
