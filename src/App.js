import React, { useCallback, useState, useEffect } from "react";
import { DayForecast } from "./DayForecast/DayForecast.js";
import { WEATHER_APP_ID } from "./constants.js";
import './App.css';

const api_url =
		`https://api.openweathermap.org/data/2.5/weather?zip=050022,CO&units=metric&appid=1cda4e7ec4878b0bfaa93961d1294169`;

const DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function App() {
  console.log("App rendering")
  const [day, setDay] = useState(0);
  const [image, setImage] = useState("");
  const [tempMax, setTempMax] = useState(0);
  const [tempMin, setTempMin] = useState(0);

  const getWeatherData = useCallback(async() => {
    const response = await fetch(api_url)
    const data = await response.json()

    const timestampInSeconds = data.dt
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()]
    setDay(dayOfWeek)

    setImage(data.weather[0].icon)
    setTempMax(Math.ceil(data.main.temp_max))
    setTempMin(Math.floor(data.main.temp_min))
  }, [])

  useEffect(() => {
    getWeatherData()
  }, [getWeatherData])

  return (
    <div className="App">
      <DayForecast 
      day={day}
      image={`http://openweathermap.org/img/wn/${image}@2x.png`}
      tempMax={tempMax}
      tempMin={tempMin} />
    </div>
  );
}

export default App;
