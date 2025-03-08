import { useState } from "react";

function WeatherFetch() {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState("");

  function kelvinToCelsius(kelvin) {
    return Math.round((kelvin - 273.15) * 100) / 100;
  }
  async function getWeather() {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
    );

    const data = await response.json();
    const lat = data[0].lat;
    const lon = data[0].lon;
    console.log(data, lat, lon);
    const response2 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data2 = await response2.json();
    console.log(data2);
    setWeather(data2);
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
      </div>

      <div style={{ backgroundColor: "#eee" }} className="showWeather">
        {weather.main && (
          <div>
            <h4>Weather Details:</h4>
            <h5>
              <span className="bg-warning p-1">{weather.name}</span>
            </h5>
            <div className="border border-4 border-dark w-25 p-3 mb-2">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="bg-secondary"
              />
              <br />
              <span className="fw-bold">{weather.weather[0].description}</span>
            </div>

            {/* Temperature Section */}
            <p className="fw-bold bg-secondary text-warning fs-2 m-0">
              <i className="bi bi-thermometer ms-2"></i> Temperature
            </p>
            <table className="table">
              <tbody className="border border-dark">
                <tr className="border-dark">
                  <td className="text-center border-end border-dark">
                    <span className="fw-bold">now: </span>
                    {kelvinToCelsius(weather.main.temp)} °C
                  </td>
                  <td className="text-center">
                    <span className="fw-bold">min: </span>
                    {kelvinToCelsius(weather.main.temp_min)} °C
                  </td>
                </tr>
                <tr className="border-dark">
                  <td className="text-center border-end border-dark">
                    <span className="fw-bold">feels like: </span>
                    {kelvinToCelsius(weather.main.feels_like)} °C
                  </td>
                  <td className="text-center">
                    <span className="fw-bold">max: </span>
                    {kelvinToCelsius(weather.main.temp_max)} °C
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Humidity & Pressure Section */}
            <p className="fw-bold bg-secondary text-warning fs-2 m-0">
              <i className="bi bi-droplet-fill ms-2"></i> Humidity & Pressure
            </p>
            <table className="table">
              <tbody className="border border-dark">
                <tr className="border-dark">
                  <td className="text-center border-end border-dark">
                    <span className="fw-bold">Humidity: </span>
                    {weather.main.humidity}%
                  </td>
                  <td className="text-center">
                    <span className="fw-bold">Pressure: </span>
                    {weather.main.pressure} hPa
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Wind Section */}
            {weather.wind && (
              <>
                <p className="fw-bold bg-secondary text-warning fs-2 m-0">
                  <i className="bi bi-wind ms-2"></i> Wind
                </p>
                <table className="table">
                  <tbody className="border border-dark">
                    <tr className="border-dark">
                      <td className="text-center border-end border-dark">
                        <span className="fw-bold">Speed: </span>
                        {weather.wind.speed} m/s
                      </td>
                      <td className="text-center">
                        <span className="fw-bold">Direction: </span>
                        {weather.wind.deg}°
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {/* Clouds & Visibility Section */}
            {weather.clouds && (
              <>
                <p className="fw-bold bg-secondary text-warning fs-2 m-0">
                  <i className="bi bi-cloud ms-2"></i> Clouds & Visibility
                </p>
                <table className="table">
                  <tbody className="border border-dark">
                    <tr className="border-dark">
                      <td className="text-center border-end border-dark">
                        <span className="fw-bold">Cloudiness: </span>
                        {weather.clouds.all}%
                      </td>
                      <td className="text-center">
                        <span className="fw-bold">Visibility: </span>
                        {weather.visibility} m
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {/* Sunrise & Sunset Section */}
            {weather.sys && (
              <>
                <p className="fw-bold bg-secondary text-warning fs-2 m-0">
                  <i className="bi bi-sunrise ms-2"></i> Sunrise & Sunset
                </p>
                <table className="table">
                  <tbody className="border border-dark">
                    <tr className="border-dark">
                      <td className="text-center border-end border-dark">
                        <span className="fw-bold">Sunrise: </span>
                        {new Date(
                          weather.sys.sunrise * 1000
                        ).toLocaleTimeString()}
                      </td>
                      <td className="text-center">
                        <span className="fw-bold">Sunset: </span>
                        {new Date(
                          weather.sys.sunset * 1000
                        ).toLocaleTimeString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherFetch;
