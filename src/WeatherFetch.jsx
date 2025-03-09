import { useState } from "react";

function WeatherFetch() {
  // State management
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [weather, setWeather] = useState({}); // Current weather data
  const [forecast, setForecast] = useState([]); // 5-day forecast data
  const [next12HoursForecast, setNext12HoursForecast] = useState([]); // Next 12 hours forecast
  const [location, setLocation] = useState(""); // User input location
  const [error, setError] = useState(null); // Error messages

  // Utility functions
  function kelvinToCelsius(kelvin) {
    // Convert Kelvin to Celsius
    return Math.round((kelvin - 273.15) * 100) / 100;
  }

  // API interaction
  async function getWeather() {
    // Fetch current and forecast weather data
    setError(null);
    if (!location) {
      // Validate location
      setError("Please enter a city name.");
      return;
    }

    try {
      const geoResponse = await fetch(
        // Fetch coordinates
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        // Check if city found
        setError("City not found.");
        return;
      }

      const lat = geoData[0].lat;
      const lon = geoData[0].lon;

      const weatherResponse = await fetch(
        // Fetch current weather
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const forecastResponse = await fetch(
        // Fetch 5-day forecast
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();
      setForecast(forecastData.list);
      console.log(forecastData);

      // Filter for the next 12 hours
      const now = new Date().getTime() / 1000; // Current time in seconds
      const twelveHoursLater = now + 12 * 60 * 60; // 12 hours later in seconds

      const next12Hours = forecastData.list.filter((item) => {
        return item.dt >= now && item.dt <= twelveHoursLater;
      });
      setNext12HoursForecast(next12Hours);
    } catch (err) {
      // Handle errors
      setError("Fetch failed.");
      console.error(err);
    }
  }

  // Time conversion
  function getSunriseTime(weatherData) {
    // Get sunrise time
    const sunriseUtc = weatherData.sys.sunrise;
    const sunriseLocal = new Date((sunriseUtc + weatherData.timezone) * 1000);
    return sunriseLocal.toLocaleTimeString();
  }

  function getSunsetTime(weatherData) {
    // Get sunset time
    const sunsetUtc = weatherData.sys.sunset;
    const sunsetLocal = new Date((sunsetUtc + weatherData.timezone) * 1000);
    return sunsetLocal.toLocaleTimeString();
  }
  function getLocationName() {
    // Get location name
    return weather.name;
  }

  // Rendering
  return (
    <div className="container-fluid m-0 p-0">
      {/* Search input and button */}
      <div
        className="d-flex my-5 flex-column justify-content-center align-items-center"
        role="search"
      >
        <input
          className="form-control w-50 mb-3"
          type="search"
          placeholder="Search any city..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="d-flex justify-content-center py-3 w-100">
          <span className="me-3 fs-3">weather</span>
          <button onClick={getWeather} className="btn btn-jet fs-4 py-0 px-3">
            fetch
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      {weather.main && (
        <div className="row justify-content-around m-0 p-0">
          <h1 className="text-jet fw-bold py-3">{getLocationName()}</h1>
        </div>
      )}

      {/* Current weather display */}
      <div className="row justify-content-around m-0 p-0">
        {weather.main && (
          <div className=" col-6 m-0 p-0 text-jet border">
            <h2 className="fs-5 fw-bold p-3 text-center bg-air">
              {" "}
              current weather
            </h2>
            <div className="d-flex align-items-start">
              <div className="">
                <img
                  className="icon-overview"
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt="weather icon"
                  style={{ height: "130px", width: "130px" }}
                />
                <p className="text-center bg-jet text-anti mb-0">
                  {weather.weather[0].main.toLowerCase()}
                </p>
              </div>
              <div className="parameters text-start ms-4">
                <p className="mb-1">
                  <i className="bi bi-thermometer-half me-2"></i>
                  Temperature: {kelvinToCelsius(weather.main.temp)}°C
                </p>
                <p className="mb-1 text-muted fs-6">
                  (Min: {kelvinToCelsius(weather.main.temp_min)}°C, Max:{" "}
                  {kelvinToCelsius(weather.main.temp_max)}°C, Feels:{" "}
                  {kelvinToCelsius(weather.main.feels_like)}°C)
                </p>
                <p className="mb-1">
                  <i className="bi bi-moisture me-2"></i>
                  Humidity: {weather.main.humidity}%
                </p>
                <p className="mb-1">
                  <i className="bi bi-wind me-2"></i>
                  Wind: {weather.wind.speed} m/s
                </p>
                <span className="me-3">
                  <i className="bi bi-sunrise me-2"></i>
                  Sunrise: {getSunriseTime(weather)}
                </span>
                <span className="">
                  <i className="bi bi-sunset me-2"></i>
                  Sunset: {getSunsetTime(weather)}
                </span>
              </div>
            </div>
          </div>
        )}

        {next12HoursForecast.length > 0 && (
          <div className="col-6 text-jet shadow-sm m-0 p-0">
            <h2 className="fs-5 fw-bold p-3 text-center bg-air">
              next 12 hours
            </h2>
            <div className=" p-0 m-0">
              <table className="table text-center">
                <tbody>
                  <tr>
                    {next12HoursForecast.map((item) => (
                      <td
                        key={`forecast-${item.dt}`}
                        className="px-3 border border-jet border-start-0 border-top-0 border-bottom-0"
                      >
                        <div className="d-flex flex-column align-items-center">
                          <img
                            src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt="hourly icon"
                            style={{ height: "50px", width: "50px" }}
                          />
                          <p className="mb-1">
                            <i className="bi bi-thermometer-half me-2"></i>
                            {kelvinToCelsius(item.main.temp)}°C
                          </p>
                          <p className="mb-0">
                            <i className="bi bi-moisture me-2"></i>
                            {item.main.humidity}%
                          </p>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="">
                    {next12HoursForecast.map((item) => (
                      <td key={`time-${item.dt}`} className="fw-bold bg-jet">
                        {new Date(item.dt * 1000).toLocaleTimeString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5-day forecast display in a single card */}
      {forecast.length > 0 && (
        <div className="row justify-content-center">
          <div className="col-12 text-jet shadow-sm m-0 p-0">
            <h2 className="fs-5 fw-bold p-3 text-center bg-air">
              5 days forecast
            </h2>
            <div className="p-0 m-0">
              <table className="table text-center">
                <tbody>
                  <tr>
                    {forecast
                      .filter((item, index) => index % 8 === 0)
                      .map((item) => (
                        <td
                          key={item.dt}
                          className="px-3 border border-jet border-start-0 border-top-0 border-bottom-0"
                        >
                          <div className="d-flex flex-column align-items-center">
                            <img
                              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                              alt="forecast icon"
                              style={{ height: "50px", width: "50px" }}
                            />
                            <p className="mb-1">
                              <i className="bi bi-thermometer-half me-2"></i>
                              {kelvinToCelsius(item.main.temp)}°C
                            </p>
                            <p className="mb-0">
                              <i className="bi bi-moisture me-2"></i>
                              {item.main.humidity}%
                            </p>
                          </div>
                        </td>
                      ))}
                  </tr>
                  <tr className="">
                    {forecast
                      .filter((item, index) => index % 8 === 0)
                      .map((item) => (
                        <td
                          key={`date-${item.dt}`}
                          className="fw-bold bg-jet text-anti border border-anti border-start-0 border-top-0 border-bottom-0"
                        >
                          {new Date(item.dt * 1000).toLocaleDateString()}
                        </td>
                      ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherFetch;
