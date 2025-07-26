import React from 'react';
import AQIChecker from './components/AQIChecker';
import WeatherWidget from './components/WeatherWidget';

function App() {
  return (
    <div style={{ padding: '2rem', background: '#f0f0f0', minHeight: '100vh' }}>
      <AQIChecker />
      <WeatherWidget />
    </div>
  );
}

export default App;
