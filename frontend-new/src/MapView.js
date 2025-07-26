// src/MapView.js
import React from 'react';
import CesiumMap from './CesiumMap';

function MapView({ city }) {
  return (
    <div style={{ height: '500px', marginTop: '2rem' }}>
      <CesiumMap city={city} />
    </div>
  );
}

export default MapView;
