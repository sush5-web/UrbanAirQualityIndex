import React from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const CityMap = ({ location, aqiData }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded || !location) return null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={10}
    >
      <Marker position={location}>
        {aqiData && (
          <InfoWindow position={location}>
            <div>
              <h3>{aqiData.city}</h3>
              <p><strong>AQI:</strong> {aqiData.indexes[0].aqi}</p>
              <p><strong>Category:</strong> {aqiData.indexes[0].category}</p>
              <p><strong>Dominant Pollutant:</strong> {aqiData.indexes[0].dominantPollutant}</p>
              <p><strong>Source:</strong> {aqiData.source}</p>
            </div>
          </InfoWindow>
        )}
      </Marker>
    </GoogleMap>
  );
};

export default CityMap;
