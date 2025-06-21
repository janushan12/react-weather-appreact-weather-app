import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import searchIcon from "../assets/search.jpg";
import humidityIcon from "../assets/humidity.png";
import uvIcon from "../assets/uv.png";
import visibility from "../assets/visibility.png";
import hourly from "../assets/24-hours.png";
import daily from "../assets/daily.png";
// import drizzleIcon from "../assets/Drizzle-weather.png";
// import cloudyIcon from "../assets/partly-cloudy.png";
// import rainIcon from "../assets/rain.png";
// import snowIcon from "../assets/snow.jpg";
import clearIcon from "../assets/weather-clear.png";
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
        visMiles: data.current.vis_miles,
        name: data.location.name,
        country: data.location.country,
        temperature: Math.floor(data.current.temp_c),
        icon: data.current.condition.icon,
        text: data.current.condition.text,
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
      <div className="detailed-div">
        <div className="search-bar">
          <input
            id="search"
            ref={inputRef}
            type="text"
            placeholder="Enter city name"
          />
          <img
            src={searchIcon}
            alt=""
            onClick={() => search(inputRef.current.value)}
          />
        </div>
        {weatherData && (
          <>
            <div className="temp-icon">
              <img src={weatherData.icon} alt="" className="weather-icon" />
              <div className="temp-info">
                <p className="temperature">{weatherData.temperature}°c</p>
                <span className="weather-text">{weatherData.text}</span>
              </div>
            </div>
            <div className="location">
              <p>
                {weatherData.name}, {weatherData.country}
              </p>
            </div>
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
              <div className="col">
                <img src={visibility} alt="" />
                <div>
                  <p>{weatherData.visMiles} mi</p>
                  <span>Visibility</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="forecast-div">
        <div className="hourly-div">
          <div className="heading-hourly">
            <img src={hourly} alt="" />
            <p>HOURLY FORECAST</p>
          </div>
          <div className="hourly-data-table">
            <div className="h-data">
              <p>Now</p>
              <span>28°</span><br/>
              <img src={clearIcon} alt="" />
            </div>
            <div className="h-data">
              <p>Now</p>
              <span>28°</span><br/>
              <img src={clearIcon} alt="" />
            </div>
            <div className="h-data">
              <p>Now</p>
              <span>28°</span><br/>
              <img src={clearIcon} alt="" />
            </div>
          </div>
        </div>
        <div className="days-div">
          <div className="heading-hourly">
            <img src={daily} alt="" />
            <p>10 Day FORECAST</p>
          </div>
          <div className="hourly-data-table">
            <div className="h-data">
              <p>Now</p>
              <span>28°</span><br/>
              <img src={clearIcon} alt="" />
            </div>
            <div className="h-data">
              <p>Now</p>
              <span>28°</span><br/>
              <img src={clearIcon} alt="" />
            </div>
            <div className="h-data">
              <p>Now</p>
              <span>28°</span><br/>
              <img src={clearIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
