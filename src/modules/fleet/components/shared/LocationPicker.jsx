import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// FIX: Default Leaflet icons often break in React. This fixes the marker icon.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// SUB-COMPONENT: Handles clicking on the map to drop a pin
const MapClickHandler = ({ onChange }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // Format to 6 decimal places for precision/cleanliness
      onChange(lat.toFixed(6), lng.toFixed(6));
    },
  });
  return null;
};

// SUB-COMPONENT: Handles "Flying" to a new location when coordinates change via Input/Search
const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 16, { duration: 1.5 }); // Smooth Cinematic Fly-in
    }
  }, [lat, lng, map]);
  return null;
};

const LocationPicker = ({ lat, lng, onChange }) => {
  // Default to Uganda (Kampala) if no coords provided
  // If lat/lng are strings, convert to float for Leaflet
  const safeLat = parseFloat(lat) || 0.3476;
  const safeLng = parseFloat(lng) || 32.5825;
  const center = [safeLat, safeLng]; 
  
  const hasPin = lat && lng;

  return (
    <div style={{ height: '100%', width: '100%', zIndex: 1 }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* LOGIC: Click to Pin */}
        <MapClickHandler onChange={onChange} />
        
        {/* LOGIC: Fly to Input */}
        <FlyToLocation lat={lat} lng={lng} />

        {/* VISUAL: The Pin */}
        {hasPin && <Marker position={[safeLat, safeLng]} />}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;