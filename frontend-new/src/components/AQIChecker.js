// frontend/src/components/AQIChecker.js
import React, { useState } from 'react';
import './AQIChecker.css';

const AQIChecker = () => {
  const [city, setCity]       = useState('');
  const [aqi, setAqi]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchAqi = async () => {
    setLoading(true);
    setError(null);
    setAqi(null);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/aqi?city=${encodeURIComponent(city)}`
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { aqi } = await res.json();
      setAqi(aqi);
    } catch {
      setError('Failed to fetch AQI.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (city.trim()) fetchAqi();
  };

  return (
    <div className="aqi-container">
      <form onSubmit={handleSubmit} className="aqi-form">
        <label htmlFor="city" className="aqi-label">
          Enter city name:
        </label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="aqi-input"
        />
        <button
          type="submit"
          disabled={loading}
          className="aqi-button"
        >
          {loading ? 'Loading…' : 'Submit'}
        </button>

        {aqi !== null && (
          <p className="aqi-result">
            AQI for <strong>{city}</strong>: {aqi}
          </p>
        )}
        {error && (
          <p className="aqi-error">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default AQIChecker;
