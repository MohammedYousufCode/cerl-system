import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Map from '../components/map/Map';
import ResourceList from '../components/resources/ResourceList';
import SearchFilters from '../components/common/SearchFilters';
import AlertBanner from '../components/common/AlertBanner';
import resourceService from '../services/resourceService';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ maxDistance: 50 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState('detecting'); // detecting, detected, fallback

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadResources();
    }
  }, [userLocation, filters]);

  // ✅ Updated getUserLocation function
  const getUserLocation = () => {
    const MYSORE_COORDS = [12.2958, 76.6394]; // Fallback location
    
    console.log('🔍 Starting location detection...');
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocation not supported by browser');
      alert('Your browser does not support location services. Using demo location.');
      setUserLocation(MYSORE_COORDS);
      setLocationStatus('fallback');
      return;
    }

    setLocationStatus('detecting');
    
    // Request location with options
    const options = {
      enableHighAccuracy: true,  // Use GPS if available
      timeout: 10000,            // Wait max 10 seconds
      maximumAge: 0              // Don't use cached location
    };

    console.log('📍 Requesting location permission...');
    
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const detectedLat = position.coords.latitude;
        const detectedLon = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        console.log('✅ LOCATION DETECTED SUCCESSFULLY!');
        console.log('  Latitude:', detectedLat);
        console.log('  Longitude:', detectedLon);
        console.log('  Accuracy:', accuracy, 'meters');
        
        setUserLocation([detectedLat, detectedLon]);
        setLocationStatus('detected');
        
        // Show success message
        alert(`✅ Location detected!\nLat: ${detectedLat.toFixed(4)}\nLon: ${detectedLon.toFixed(4)}\nAccuracy: ${Math.round(accuracy)}m`);
      },
      // Error callback
      (error) => {
        console.error('❌ Geolocation Error:', error);
        
        let errorMessage = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access in your browser settings.";
            console.error('🚫 User denied location permission');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            console.error('❓ Location info unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            console.error('⏱️ Location request timeout');
            break;
          default:
            errorMessage = "Unknown error occurred.";
            console.error('❌ Unknown error');
        }
        
        console.log('📍 Using fallback location: Mysore');
        alert(errorMessage + '\n\nUsing demo location: Mysore, Karnataka');
        
        setUserLocation(MYSORE_COORDS);
        setLocationStatus('fallback');
      },
      options
    );

    // Also try to watch position continuously
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log('📍 Position updated:', lat, lon);
        setUserLocation([lat, lon]);
      },
      (error) => {
        console.log('Watch position error:', error.message);
      },
      options
    );
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading resources near:', userLocation);
      console.log('📏 Max distance:', filters.maxDistance || 50, 'km');
      
      const data = await resourceService.getNearbyResources(
        userLocation[0],
        userLocation[1],
        filters.maxDistance || 50,
        {
          type: filters.type || '',
          status: filters.status || '',
          search: filters.search || '',
        }
      );
      
      console.log('✅ Resources loaded:', data.length);
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      console.error('❌ Error loading resources:', error);
      setResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('🔄 Filters changed:', newFilters);
    setFilters(newFilters);
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    console.log('📍 Resource clicked:', resource.name);
  };

  return (
    <div className="h-screen flex flex-col">
      <AlertBanner />

      {/* Header */}
      <header className="bg-white shadow-md z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-700 hover:text-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">CERL - Emergency Resources</h1>
            {userLocation && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {locationStatus === 'detected' && '📍 Your Location Detected'}
                {locationStatus === 'fallback' && '📍 Demo Location: Mysore, Karnataka'}
                {locationStatus === 'detecting' && '🔍 Detecting location...'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, <span className="font-semibold">{user.username}</span>
              </span>
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100 hover:bg-blue-100"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {(user.role === 'coordinator' || user.role === 'admin') && (
                  <Link
                    to="/coordinator"
                    className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-100 hover:bg-green-100"
                  >
                    Coordinator Panel
                  </Link>
                )}
                <Link
                  to="/submit"
                  className="text-xs bg-purple-50 text-purple-700 px-3 py-2 rounded-lg border border-purple-100 hover:bg-purple-100"
                >
                  Submit Resource
                </Link>
              </div>
              <button
                onClick={logout}
                className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Emergency Helpline Banner */}
      <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium z-30">
        <strong>🚨 Emergency Helplines:</strong> 
        <span className="mx-2">Police: 100</span> | 
        <span className="mx-2">Fire: 101</span> | 
        <span className="mx-2">Ambulance: 108</span> | 
        <span className="mx-2">Disaster: 1077</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:static
          inset-y-0 left-0
          z-30
          w-80
          bg-gray-50
          border-r border-gray-200
          overflow-y-auto
          transition-transform duration-300
          flex flex-col
          pt-16 md:pt-0
        `}>
          <div className="p-4 space-y-4">
            <SearchFilters
              onFilterChange={handleFilterChange}
              userLocation={userLocation}
            />
            
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-3">
                Resources Found: {filteredResources.length}
              </h3>
              <ResourceList
                resources={filteredResources}
                onResourceClick={handleResourceClick}
                loading={loading}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Map + details */}
        <main className="flex-1 relative">
          <Map
            resources={filteredResources}
            userLocation={userLocation}
            selectedResource={selectedResource}
            onResourceClick={handleResourceClick}
            maxDistance={filters.maxDistance || 50}
          />

          {selectedResource && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[480px] bg-white shadow-2xl rounded-xl p-4 border border-gray-200 z-30">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {selectedResource.type}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedResource.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedResource.address}</p>
                  {selectedResource.distance !== undefined && (
                    <p className="text-sm text-primary font-semibold mt-1">
                      📍 {selectedResource.distance} km away
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mt-2">📞 {selectedResource.contact}</p>
                  {selectedResource.helpline && (
                    <p className="text-sm text-red-600 font-medium">🚨 {selectedResource.helpline}</p>
                  )}
                  {selectedResource.capacity && selectedResource.available_capacity !== undefined && (
                    <p className="text-sm text-gray-700 mt-2">
                      Capacity: {selectedResource.available_capacity}/{selectedResource.capacity}
                    </p>
                  )}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                  {selectedResource.status?.toUpperCase()}
                </span>
              </div>

              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedResource.latitude},${selectedResource.longitude}`,
                    '_blank'
                  )
                }
                className="mt-3 w-full bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Get Directions
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;