import React, { useCallback, useState, useEffect } from "react";
import { DayForecast } from "./DayForecast/DayForecast.js";
// import { WEATHER_APP_ID } from "./constants.js";
import moment from "moment-timezone";
import './App.css';

const MED_ID = 3674962

// const api_url_five_days = `https://api.openweathermap.org/data/2.5/forecast?id=${MED_ID}&appid=1cda4e7ec4878b0bfaa93961d1294169&units=metric&mode=json`

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

// const getFirstElementOfList = (l) => {
//   return l[0]
// }

const getLastElementOfList = (l) => {
  return l[l.length-1]
}

const getDateWithLocalTimezone = (obj) => {
  const { dt: timestampInSeconds } = obj
  const timestamp = timestampInSeconds * 1000;
  const dateWithLocalTimezone = moment(timestamp).format("YYYY-MM-DD")
  const newObj = {
    ...obj,
    dateWithLocalTimezone,
  };
  return newObj
}

const generateCitiesLookup = (array) => {
  const newObject = {}
  for (let i in array) {
    newObject[array[i].id] = array[i].name
  }
  return newObject
}

const getFormattedCityName = (array) => {
  const newObject = {}
  for (let i in array) {
    newObject[array[i].id] = array[i].name.normalize("NFD").replace(/[/. \u0300-\u036f]/g, "").toLowerCase();
  }
  return newObject
  
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position)
      });
    } else {
      reject("No navigator.geolocation available")
    }
  },)
}

function getKeyByValue(object, value) {
  for (var prop in object) {
      if (object.hasOwnProperty(prop)) {
          if (object[prop] === value)
          return prop;
      }
  }
}

let formattedResponseCityName = "";


function App() {

  console.log("App rendering")
  const [selectedCityID, setSelectedCityID] = useState(null)
  const [weatherData, setWeatherData] = useState([])
  // const [day, setDay] = useState(0);
  // const [image, setImage] = useState("");
  // const [tempMax, setTempMax] = useState(0);
  // const [tempMin, setTempMin] = useState(0);

  const citiesData = require("./cities_list.json")

  const getCurrentPosition = useCallback(async () => {
    const location = await getPosition();
    const latitude = location.coords.latitude
    const longitude = location.coords.longitude
    
    const api_url_location = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=1cda4e7ec4878b0bfaa93961d1294169`
    const response = await fetch(api_url_location)
    const data = await response.json()
    console.log("getCurrentPosition > data: ", data)
    
    formattedResponseCityName = data[0].local_names.en.normalize("NFD").replace(/[/. \u0300-\u036f]/g, "").toLowerCase();

    const newCitiesObj = getFormattedCityName(citiesData)
    setSelectedCityID(getKeyByValue(newCitiesObj, formattedResponseCityName))

  }, [citiesData])


  useEffect(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  const getWeatherData = useCallback(async() => {
    try {
      //Day Forecast
      // const response = await fetch(api_url)
      //5-Day Forecast
      const api_url_five_days = `https://api.openweathermap.org/data/2.5/forecast?id=${selectedCityID}&appid=1cda4e7ec4878b0bfaa93961d1294169&units=metric&mode=json`
      // const api_url_location = `http://api.openweathermap.org/geo/1.0/reverse?lat=51.5098&lon=-0.1180&limit=5&appid=1cda4e7ec4878b0bfaa93961d1294169`
      
      const response = await fetch(api_url_five_days)
      const data = await response.json()
      console.log("data: ", data)
      const newList = data.list.map(getDateWithLocalTimezone)
      
      const groupedObject = groupBy(newList, "dateWithLocalTimezone")
      console.log("GROUPED OBJ: ", groupedObject)
      const newObject = valmap(groupedObject, getLastElementOfList)
      const dataList = Object.values(newObject)

      const apiWeatherData = dataList.map(e => ({
        day: DAYS_OF_WEEK[(new Date(e.dt * 1000)).getDay()],
        image: e.weather[0].icon,
        tempMax: Math.ceil(e.main.temp_max),
        tempMin:Math.floor(e.main.temp_min)
      }))

      setWeatherData(apiWeatherData)
    }
    catch (error) {
      console.error(error)
    }
  }, [selectedCityID])

  useEffect(() => {
    getWeatherData()
  }, [getWeatherData])


  const onCityIDChange = (event) => {
    console.log("event.target.value: ", event.target.value)
    setSelectedCityID(event.target.value)
  }
  const lookup = generateCitiesLookup(citiesData)
  const cityName = lookup[selectedCityID]
  console.log("city Name: ", cityName)

  console.log("Formatted cities: ", getFormattedCityName(citiesData))


  return (
    <div className="App">
      <div className="city__selector">
        <div className="city__selector__container">
        <label htmlFor="cities" className="label__text">Choose a city: </label>
          <select name="cities" id="cities" className="selector" value={selectedCityID} onChange={onCityIDChange}>
            {citiesData.map((e, i) => (
              <option key={i} value={e.id}>{e.name}</option>
            ))}
          </select>
          <br></br>
        </div>
      </div>
      <div className="city__name">
        <div className="city__name__container">
          {cityName}
        </div>
      </div>
      <div className="dayforecast__container">
        {weatherData.map((e, i) => (
          <DayForecast
            key={i}
            day={e.day}
            image={`http://openweathermap.org/img/wn/${e.image}@2x.png`}
            tempMax={`H:${e.tempMax}º`}
            tempMin={`L:${e.tempMin}º`}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
