import { useState } from "react";

function WeatherFetch() {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);

  function kelvinToCelsius(kelvin) {
    return Math.round((kelvin - 273.15) * 100) / 100;
  }
  async function getWeather() {
    if (!location) {
      setError("Please enter a city name.");
      return;
    }

    setError(null);

    try {
      const geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        setError("City not found. Please try another.");
        return;
      }

      const lat = geoData[0].lat;
      const lon = geoData[0].lon;

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      const timezoneOffsetSeconds = weatherData.timezone;
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to fetch weather data. Try again later.");
      console.error(err);
    }
  }
  function getSunriseTime(weatherData) {
    const timezoneOffsetSeconds = weatherData.timezone;
    const sunriseUtc = weatherData.sys.sunrise;
    const sunriseLocal = new Date((sunriseUtc + timezoneOffsetSeconds) * 1000);

    return sunriseLocal.toLocaleTimeString();
  }

  function getSunsetTime(weatherData) {
    const timezoneOffsetSeconds = weatherData.timezone;
    const sunsetUtc = weatherData.sys.sunset;
    const sunsetLocal = new Date((sunsetUtc + timezoneOffsetSeconds) * 1000);

    return sunsetLocal.toLocaleTimeString();
  }

  return (
    <div className="container-fluid py-3">
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

      <div style={{ backgroundColor: "#eee" }} className="showWeather">
        {weather.main && (
          <div className="bg-light w-50 text-dark p-4 rounded shadow m-2">
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
    </div>
  );
}

export default WeatherFetch;
