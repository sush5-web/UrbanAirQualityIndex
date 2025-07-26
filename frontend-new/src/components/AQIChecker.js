import React, { useState } from 'react';
import './AQIChecker.css';

const CATEGORY = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Very Poor',
};

export default function AQIChecker() {
  const [city, setCity]     = useState('');
  const [aqi, setAqi]       = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    setAqi(null);
    setSummary('');

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/summary?city=${encodeURIComponent(city)}`
      );
      if (!res.ok) {
        const { detail } = await res.json().catch(() => ({}));
        throw new Error(detail || `Server returned ${res.status}`);
      }
      const { aqi, summary } = await res.json();
      setAqi(aqi);
      setSummary(summary);
    } catch (e) {
      setError(e.message || 'Failed to fetch summary.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (city.trim()) fetchSummary();
  };

  return (
    <div className="aqi‐checker">
      <form onSubmit={handleSubmit}>
        <label>
          Enter city or ZIP:
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="e.g. London or 94103"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Get AQI & Summary'}
        </button>
      </form>

      {error && <p className="aqi‐error">{error}</p>}

      {aqi !== null && (
        <div className="aqi‐result">
          <p>
            <strong>AQI Index:</strong> {aqi} ({CATEGORY[aqi] || 'Unknown'})
          </p>
        </div>
      )}

      {summary && (
        <div className="aqi‐summary">
          <h3>Health Advisory</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
