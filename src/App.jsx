import Navbar from "./Weather-Project/Navbar/Navbar";
import "./App.css";
import WeatherCard from "./Weather-Project/CurrentWeather/CurrentWeather";
import Forecast from "./Weather-Project/ForcastList/ForecastList";
import ForcastList from "./Weather-Project/ForcastList/ForecastList";


export default function App(){
  return(
    <>

    <div className="app">
      <Navbar />
      <WeatherCard />
      <ForcastList />
    </div>
    
    
    
    </>
  )
}