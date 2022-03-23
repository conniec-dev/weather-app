import React, { useState } from "react";
import { DayForecast } from "./DayForecast/DayForecast.js";
import { GetData } from "./GetData.js";
import logo from './logo.svg';
import './App.css';

const api_url =
	"https://api.openweathermap.org/data/2.5/weather?zip=050022,CO&units=metric&appid=1cda4e7ec4878b0bfaa93961d1294169";


// const fakeData = {
//   day: "Mon",
// //   tempMax: 24,
// //   tempMin: 20,
// };

function App() {
  const [day, setDay] = React.useState(0);
  const [image, setImage] = React.useState("");
  const [tempMax, setTempMax] = React.useState(0);
  const [tempMin, setTempMin] = React.useState(0);

  GetData(api_url).then(data => {
    setDay(data.dt)
    const a = new Date(day*1000);
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    setDay(days[a.getDay()])
    setImage(data.weather[0].icon)
    setTempMax(Math.ceil(data.main.temp_max))
    setTempMin(Math.floor(data.main.temp_min))
  })


  

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
