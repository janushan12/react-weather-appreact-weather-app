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
// import clearIcon from "../assets/weather-clear.png";
import windIcon from "../assets/wind.png";

const Weather = () => {
  const inputRef = useRef();

  const [weatherData, setWeatherData] = useState(false);
  const [upcomingForecast, setUpcomingForecast] = useState([]);
  const [tenDaysForecast, setTenDaysForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const errorAlertShown = useRef(false);

  const search = async (city) => {
    if (city === "") {
      alert("Enter a city name");
      return;
    }
    setIsLoading(true);

    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?q=${city}&key=${
        import.meta.env.VITE_API
      }&days=10`;
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

      //Forecast Details
      // Combine today & tomorrow's hourly forecast
      const hourlyDataToday = data.forecast.forecastday[0].hour;
      const hourlyDataTomorrow = data.forecast.forecastday[1]?.hour || [];
      const allHoursData = [...hourlyDataToday, ...hourlyDataTomorrow];

      // Get current time
      const now = new Date();

      // Format current time to match weatherAPI time string: "YYYY-MM-DD HH:00"
      const pad = (n) => n.toString().padStart(2, "0");
      const nextHourDate = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
      const nextHourStr = `${nextHourDate.getFullYear()}-${pad(
        nextHourDate.getMonth() + 1
      )}-${pad(nextHourDate.getDate())} ${pad(nextHourDate.getHours())}:00`;

      //FInd the index in the full hourly array
      const startIndex = allHoursData.findIndex(
        (item) => item.time === nextHourStr
      );

      // Slice 10 hours from that point
      const upcomingHourlyForecast =
        startIndex !== -1
          ? allHoursData.slice(startIndex, startIndex + 10)
          : [];
      setUpcomingForecast(upcomingHourlyForecast);

      // 10 Days Forecast
      setTenDaysForecast(data.forecast.forecastday);
      // console.log(data.forecast.forecastday[0].date)
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
      inputRef.current.value = ""; 
    }
  };

  useEffect(() => {
    search("Colombo");
  }, []);

  return (
    <div className="weather">
      {isLoading && (
        <div className="loading-overlay">
          <img src="/assets/global.gif" alt="Loading..." />
        </div>
      )}
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
              <img src={weatherData.icon} alt="" />
              <p>{weatherData.temperature}°</p>
            </div>
            {upcomingForecast.map((item, index) => (
              <div className="h-data" key={index}>
                <p>{item.time.split(" ")[1]}</p>
                <img src={item.condition.icon} alt={item.condition.text} />
                <p>{item.temp_c}°</p>
              </div>
            ))}
          </div>
        </div>
        <div className="days-div">
          <div className="heading-hourly">
            <img src={daily} alt="" />
            <p>10 Day FORECAST</p>
          </div>
          <div className="hourly-data-table">
            {tenDaysForecast.map((day, index) => {
              const today = new Date();
              const tomorrow = new Date();
              tomorrow.setDate(today.getDate() + 1);

              const pad = (n) => n.toString().padStart(2, "0");
              const formatDate = (d) =>
                `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
                  d.getDate()
                )}`;
              const todayStr = formatDate(today);
              const tomorrowStr = formatDate(tomorrow);

              let label;
              if (day.date === todayStr) {
                label = "Today";
              } else if (day.date === tomorrowStr) {
                label = "Tomorrow";
              } else {
                label = new Date(day.date).toLocaleDateString("en-us", {
                  weekday: "short",
                });
              }

              return (
                <div className="h-data" key={index}>
                  <p>{label}</p>
                  <img
                    src={day.day.condition.icon}
                    alt={day.day.condition.text}
                  />
                  <p>{day.day.avgtemp_c}°</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
