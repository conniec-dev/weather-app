import React, { useCallback, useState, useEffect } from "react";
import { DayForecast } from "./DayForecast/DayForecast.js";
import { WEATHER_APP_ID } from "./constants.js";
import moment from "moment-timezone";
import './App.css';

const MED_ID = 1699896

const api_url_five_days = `https://api.openweathermap.org/data/2.5/forecast?id=${MED_ID}&appid=1cda4e7ec4878b0bfaa93961d1294169&units=metric&mode=json`

// const api_url =
// 		`https://api.openweathermap.org/data/2.5/weather?zip=050022,CO&units=metric&appid=1cda4e7ec4878b0bfaa93961d1294169`;


const DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const valmap = (obj, f) => {
  let newObject = {}
  for (const property in obj) {
    // newObject[property] = obj[property][0]
    newObject[property] = f(obj[property])
  }
  return newObject
}

const getFirstElementOfList = (l) => {
  return l[0]
}

const getLastElementOfList = (l) => {
  return l[l.length-1]
}

const addProp = (obj) => {
  const { dt: timestamp } = obj
  // console.log("addProp > timestamp: ", timestamp)
  const timestampinMiliseconds = timestamp * 1000;
  const timestampWithLocalTimezone = moment(timestampinMiliseconds).format("YYYY-MM-DD")
  // console.log("timestampWithLocalTimezone", timestampWithLocalTimezone)
  const newObj = {
    ...obj,
    timestampWithLocalTimezone,
  };
  return newObj
}

function App() {
  console.log("App rendering")
  const [weatherData, setWeatherData] = useState({
    day: "",
    image: "",
    tempMax: 0,
    tempMin: 0
  })
  const [weatherData2, setWeatherData2] = useState({
    day: "",
    image: "",
    tempMax: 0,
    tempMin: 0
  })
  const [weatherData3, setWeatherData3] = useState({
    day: "",
    image: "",
    tempMax: 0,
    tempMin: 0
  })
  const [weatherData4, setWeatherData4] = useState({
    day: "",
    image: "",
    tempMax: 0,
    tempMin: 0
  })
  const [weatherData5, setWeatherData5] = useState({
    day: "",
    image: "",
    tempMax: 0,
    tempMin: 0
  })
  // const [day, setDay] = useState(0);
  // const [image, setImage] = useState("");
  // const [tempMax, setTempMax] = useState(0);
  // const [tempMin, setTempMin] = useState(0);

  const getWeatherData = useCallback(async() => {
    try {
      //Day Forecast
      // const response = await fetch(api_url)
      //5-Day Forecast
      const response = await fetch(api_url_five_days)
      const data = await response.json()
      console.log("data: ", data);

      const newList = data.list.map(addProp)
      console.log("new List: ", newList)
      
      const groupedObject = groupBy(newList, "timestampWithLocalTimezone")
      console.log("GROUPED OBJ: ", groupedObject)
      const newObject = valmap(groupedObject, getLastElementOfList)
      console.log("New object: ", newObject)
      const dataList = Object.values(newObject)
      
      //Way to calculate time for 5 days
      const dayOfWeekList = []
      for (let element in dataList) {
        const timestampInSecondsList = dataList[element].dt
        const dateList = new Date(timestampInSecondsList * 1000);
        dayOfWeekList.push(DAYS_OF_WEEK[dateList.getDay()])
      }
      console.log("dayOfWeekList: ", dayOfWeekList)

      

      setWeatherData({
        day: dayOfWeekList[0],
        image: dataList[0].weather[0].icon,
        tempMax: Math.ceil(dataList[0].main.temp_max),
        tempMin:Math.floor(dataList[0].main.temp_min)
      })
      setWeatherData2({
        day: dayOfWeekList[1],
        image: dataList[1].weather[0].icon,
        tempMax: Math.ceil(dataList[1].main.temp_max),
        tempMin: Math.floor(dataList[1].main.temp_min)
      })
      setWeatherData3({
        day: dayOfWeekList[2],
        image: dataList[2].weather[0].icon,
        tempMax: Math.ceil(dataList[2].main.temp_max),
        tempMin:Math.floor(dataList[2].main.temp_min)
      })
      setWeatherData4({
        day: dayOfWeekList[3],
        image: dataList[3].weather[0].icon,
        tempMax: Math.ceil(dataList[3].main.temp_max),
        tempMin:Math.floor(dataList[3].main.temp_min)
      })
      setWeatherData5({
        day: dayOfWeekList[4],
        image: dataList[4].weather[0].icon,
        tempMax: Math.ceil(dataList[4].main.temp_max),
        tempMin:Math.floor(dataList[4].main.temp_min)
      })
      // setDay(dayOfWeek)

      // setImage(data.weather[0].icon)
      // setTempMax(Math.ceil(data.main.temp_max))
      // setTempMin(Math.floor(data.main.temp_min))
      
    }
    catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    getWeatherData()
  }, [getWeatherData])

  return (
    <div className="App">
      <div className="dayforecast__container">
        <DayForecast 
        day={weatherData.day}
        image={`http://openweathermap.org/img/wn/${weatherData.image}@2x.png`}
        tempMax={weatherData.tempMax}
        tempMin={weatherData.tempMin} />
        <DayForecast 
        day={weatherData2.day}
        image={`http://openweathermap.org/img/wn/${weatherData2.image}@2x.png`}
        tempMax={weatherData2.tempMax}
        tempMin={weatherData2.tempMin} />
        <DayForecast 
        day={weatherData3.day}
        image={`http://openweathermap.org/img/wn/${weatherData3.image}@2x.png`}
        tempMax={weatherData3.tempMax}
        tempMin={weatherData3.tempMin} />
        <DayForecast 
        day={weatherData4.day}
        image={`http://openweathermap.org/img/wn/${weatherData4.image}@2x.png`}
        tempMax={weatherData4.tempMax}
        tempMin={weatherData4.tempMin} />
        <DayForecast 
        day={weatherData5.day}
        image={`http://openweathermap.org/img/wn/${weatherData5.image}@2x.png`}
        tempMax={weatherData5.tempMax}
        tempMin={weatherData5.tempMin} />
      </div>
    </div>
  );
}

export default App;
