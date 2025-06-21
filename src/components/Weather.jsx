import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import searchIcon from "../assets/search.jpg";
import humidityIcon from "../assets/humidity.png";
import uvIcon from "../assets/uv.png";
// import drizzleIcon from "../assets/Drizzle-weather.png";
// import cloudyIcon from "../assets/partly-cloudy.png";
// import rainIcon from "../assets/rain.png";
// import snowIcon from "../assets/snow.jpg";
// import clearIcon from "../assets/weather-clear.png";
import windIcon from "../assets/wind.png";

const Weather = () => {
  const inputRef = useRef();

  const [weatherData, setWeatherData] = useState(false);

  const errorAlertShown = useRef(false);

  const search = async (city) => {
    if (city === "") {
      alert("Enter a city name");
      return;
    }
    try {
      const url = `http://api.weatherapi.com/v1/current.json?q=${city}&key=${
        import.meta.env.VITE_API
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        if (!errorAlertShown.current) {
          alert(data.error.message);
          errorAlertShown.current = true;
        }
        return;
      }

      console.log(data);
      errorAlertShown.current = false;
      setWeatherData({
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        uv: data.current.uv,
        name: data.location.name,
        country: data.location.country,
        temperature: Math.floor(data.current.temp_c),
        icon: data.current.condition.icon,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    search("Colombo");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Enter city name" />
        <img
          src={searchIcon}
          alt=""
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {weatherData && (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°c</p>
          <p className="location">
            {weatherData.name}, {weatherData.country}
          </p>
          <div className="weather-data">
            <div className="col">
              <img src={humidityIcon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={windIcon} alt="" />
              <div>
                <p>{weatherData.windSpeed} kmph</p>
                <span>Wind Speed</span>
              </div>
            </div>
            <div className="col">
              <img src={uvIcon} alt="" />
              <div>
                <p>{weatherData.uv}</p>
                <span>UV Index</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
