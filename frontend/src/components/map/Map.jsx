import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons by resource type
const createCustomIcon = (type) => {
  const colors = {
    hospital: '#EF4444',
    police: '#3B82F6',
    fire: '#F97316',
    shelter: '#8B5CF6',
    food: '#10B981',
    water: '#06B6D4',
  };

  return L.divIcon({
    html: `<div style="background-color: ${colors[type] || '#6B7280'}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// User location icon
const userIcon = L.divIcon({
  html: '<div style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
  className: 'user-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to update map center when location changes
const MapUpdater = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

const Map = ({ resources, userLocation, selectedResource, onResourceClick, maxDistance }) => {
  const mapRef = useRef();

  const getDirections = (lat, lon) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${lat},${lon}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
      window.open(url, '_blank');
    }
  };

  const center = userLocation || [12.3051, 76.6550]; // Default to Mysore

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full z-10"
        ref={mapRef}
      >
        <MapUpdater center={userLocation} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>
            
            {/* Radius Circle */}
            <Circle
              center={userLocation}
              radius={maxDistance * 1000} // Convert km to meters
              pathOptions={{
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                color: '#3B82F6',
                weight: 2,
                opacity: 0.5,
              }}
            />
          </>
        )}

        {/* Resource Markers */}
        {resources.map((resource) => (
          <Marker
            key={resource.id}
            position={[parseFloat(resource.latitude), parseFloat(resource.longitude)]}
            icon={createCustomIcon(resource.type)}
            eventHandlers={{
              click: () => onResourceClick && onResourceClick(resource),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-base mb-2">{resource.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Type: {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Status: <span className="font-medium">{resource.status.toUpperCase()}</span>
                </p>
                {resource.distance !== undefined && (
                  <p className="text-sm text-primary font-medium mb-1">
                    Distance: {resource.distance} km
                  </p>
                )}
                <p className="text-xs text-gray-500 mb-2">{resource.address}</p>
                <p className="text-sm mb-2">📞 {resource.contact}</p>
                
                <button
                  onClick={() => getDirections(resource.latitude, resource.longitude)}
                  className="w-full bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] hidden md:block">
        <h4 className="font-bold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Hospital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Police</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Fire</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span>Shelter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Food</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
            <span>Water</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
