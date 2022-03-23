import React from "react";
import "./DayForecast.css";


// const api_url =
// 	"https://api.openweathermap.org/data/2.5/weather?zip=050022,CO&units=metric&appid=1cda4e7ec4878b0bfaa93961d1294169";


// async function getapi(url) {;
//     // Storing response
//   const response = await fetch(url);
    
//     // Storing data in form of JSON
//   var data = await response.json();
//   console.log(data);
//   console.log("tempMax: ", data.main.temp_max)
//   console.log("tempMin: ", data.main.temp_min)
// }

// getapi(api_url);

// "http://openweathermap.org/img/wn/10d@2x.png"


function DayForecast(props) {
    return (
    <div className="dayforecast__container">
      <div className="dayforecast">
        <div>{props.day}</div>
        <img src={props.image} alt="cloud" />
        <div className="temps">
          <div>{props.tempMax}</div>
          <div>{props.tempMin}</div>
        </div>
      </div>
    </div>
    )
}

export {DayForecast};


