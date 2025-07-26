// src/components/AQIChecker.js
import React, { useState } from 'react';
import './AQIChecker.css';


// A little helper to turn the 1–5 index into a category
const CATEGORY = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Very Poor',
};

export default function AQIChecker() {
  const [city, setCity] = useState('');
  const [aqi, setAqi] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAqi = async () => {
    setLoading(true);
    setError(null);
    setAqi(null);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/aqi?city=${encodeURIComponent(city)}`
      );
      if (!res.ok) {
        const { detail } = await res.json().catch(() => ({}));
        throw new Error(detail || `Server returned ${res.status}`);
      }
      const { aqi } = await res.json();
      setAqi(aqi);
    } catch (e) {
      setError(e.message || 'Failed to fetch AQI.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (city.trim()) fetchAqi();
  };

  return (
    <div className="aqi‐checker">
      <form onSubmit={handleSubmit}>
        <label>
          Enter city name or ZIP:
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="e.g. London or 94103"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Submit'}
        </button>
      </form>

      {error && <p className="aqi‐error">{error}</p>}

      {aqi !== null && !error && (
        <div className="aqi‐result">
          <p>
            <strong>Index:</strong> {aqi} (
            {CATEGORY[aqi] || 'Unknown'})
          </p>
        </div>
      )}
    </div>
  );
}
