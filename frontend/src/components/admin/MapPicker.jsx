import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

const MapPicker = ({ initialLat, initialLon, onLocationChange, height = '400px' }) => {
  const [position, setPosition] = useState(
    initialLat && initialLon ? [initialLat, initialLon] : [12.3051, 76.6550] // Default to Mysore center
  );

  useEffect(() => {
    if (initialLat && initialLon) {
      setPosition([initialLat, initialLon]);
    }
  }, [initialLat, initialLon]);

  const handleLocationSelect = (lat, lng) => {
    setPosition([lat, lng]);
    if (onLocationChange) {
      onLocationChange(lat, lng);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-sm text-gray-600">
        Click on the map to select location • Current: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </div>
      <div style={{ height, width: '100%' }} className="border border-gray-300 rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <Marker position={position} />
        </MapContainer>
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="number"
          step="0.000001"
          value={position[0]}
          onChange={(e) => {
            const lat = parseFloat(e.target.value);
            if (!isNaN(lat)) {
              setPosition([lat, position[1]]);
              if (onLocationChange) onLocationChange(lat, position[1]);
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="Latitude"
        />
        <input
          type="number"
          step="0.000001"
          value={position[1]}
          onChange={(e) => {
            const lng = parseFloat(e.target.value);
            if (!isNaN(lng)) {
              setPosition([position[0], lng]);
              if (onLocationChange) onLocationChange(position[0], lng);
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="Longitude"
        />
      </div>
    </div>
  );
};

export default MapPicker;

