import { useState } from "react";

function WeatherFetch() {
  // State management
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [weather, setWeather] = useState({}); // Current weather data
  const [forecast, setForecast] = useState([]); // 5-day forecast data
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

  // Rendering
  return (
    <div className="container-fluid py-3">
      {/* Search input and button */}
      <div
        className="d-flex my-5 flex-column justify-content-center align-items-center"
        role="search"
      >
        <h2 className="mb-3">Weather</h2>
        <input
          className="form-control w-50 mb-3"
          type="search"
          placeholder="Search any city..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={getWeather} className="btn btn-dark mb-3 fs-4 px-3">
          Fetch
        </button>
        {error && <p className="text-danger">{error}</p>}
      </div>

      {/* Current weather display */}
      <div className="showWeather row">
        {weather.main && (
          <div className="bg-light col-6 text-dark p-4 rounded shadow m-2">
            <h2 className="fs-5 fw-bold mb-3">Overview</h2>
            <div className="d-flex align-items-start">
              <img
                className="icon-overview"
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt="weather icon"
                style={{ height: "150px", width: "150px" }}
              />
              <div className="parameters text-start ms-4">
                <p className="mb-1">
                  <i className="bi bi-thermometer-half me-1"></i> Temperature:{" "}
                  {kelvinToCelsius(weather.main.temp)}°C
                </p>
                <p className="mb-1 text-muted fs-6">
                  (Min: {kelvinToCelsius(weather.main.temp_min)}°C, Max:{" "}
                  {kelvinToCelsius(weather.main.temp_max)}°C, Feels:{" "}
                  {kelvinToCelsius(weather.main.feels_like)}°C)
                </p>
                <p className="mb-1">
                  <i className="bi bi-droplet-half me-1"></i> Humidity:{" "}
                  {weather.main.humidity}%
                </p>
                <p className="mb-1">
                  <i className="bi bi-wind me-1"></i> Wind: {weather.wind.speed}{" "}
                  m/s
                </p>
                <p className="mb-1">
                  <i className="bi bi-sunrise me-1"></i> Sunrise:{" "}
                  {getSunriseTime(weather)}
                </p>
                <p className="mb-1">
                  <i className="bi bi-sunset me-1"></i> Sunset:{" "}
                  {getSunsetTime(weather)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5-day forecast display in a single card */}
      {forecast.length > 0 && (
        <div className="bg-light text-dark p-3 rounded shadow m-2 w-75">
          <h2 className="fs-5 fw-bold mb-3">5-Day Forecast</h2>
          <div className="d-flex justify-content-around">
            {forecast
              .filter((item, index) => index % 8 === 0)
              .map((item) => (
                <div key={item.dt} className="text-center">
                  <h5 className="fs-6 fw-bold mb-2">
                    {new Date(item.dt * 1000).toLocaleDateString()}
                  </h5>
                  <img
                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="forecast icon"
                    style={{ height: "50px", width: "50px" }}
                  />
                  <p className="mb-1">
                    Temp: {kelvinToCelsius(item.main.temp)}°C
                  </p>
                  <p className="mb-1">Humidity: {item.main.humidity}%</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherFetch;
