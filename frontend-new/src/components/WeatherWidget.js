// frontend/src/components/WeatherWidget.js
import React, { useState } from 'react';
import './WeatherWidget.css';

export default function WeatherWidget() {
  const [city, setCity]       = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/weather?city=${encodeURIComponent(city)}`
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      console.error(e);
      setError('Could not load weather.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h2>Current Weather</h2>
      <div className="weather-form">
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="City name"
        />
        <button onClick={fetchWeather} disabled={loading || !city.trim()}>
          {loading ? 'Loading…' : 'Get Weather'}
        </button>
      </div>

      {weather && (
        <div className="weather-result">
          <p><strong>{weather.city}</strong>: {weather.description}</p>
          <p>🌡️ {weather.temp}°C (feels like {weather.feels_like}°C)</p>
          <p>💧 Humidity: {weather.humidity}%</p>
        </div>
      )}
      {error && <p className="weather-error">{error}</p>}
    </div>
  );
}
