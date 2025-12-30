const ResourceList = ({ resources = [], onResourceClick, loading = false, filters, onFilterChange }) => {
  // Safe filters with default values
  const safeFilters = filters || {};
  
  const getResourceIcon = (type) => {
    const icons = {
      hospital: '🏥',
      police: '👮',
      fire: '🚒',
      shelter: '🏠',
      food: '🍽️',
      water: '💧',
    };
    return icons[type] || '📍';
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      full: 'bg-orange-100 text-orange-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">
          <div className="text-lg">Loading resources...</div>
          <div className="text-sm mt-2">Please wait</div>
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-lg font-medium">No resources found</p>
          <p className="text-sm mt-1">Try adjusting your filters or increasing distance</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Quick Filter Buttons - Only show if onFilterChange is provided */}
      {onFilterChange && (
        <div className="mb-4 pb-3 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Quick Filters:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange({ ...safeFilters, type: '' })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                !safeFilters.type
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {['hospital', 'police', 'fire', 'shelter', 'food', 'water'].map(type => (
              <button
                key={type}
                onClick={() => onFilterChange({ ...safeFilters, type: type })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  safeFilters.type === type 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {getResourceIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resource Cards */}
      <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
        {resources.map((resource) => (
          <div
            key={resource.id}
            onClick={() => onResourceClick && onResourceClick(resource)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-primary"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                  <h4 className="font-semibold text-gray-800">{resource.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{resource.address}</p>
                
                {/* Distance */}
                {resource.distance !== undefined && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm text-primary font-semibold">
                      📍 {resource.distance} km away
                    </span>
                  </div>
                )}

                {/* Capacity */}
                {resource.type !== 'police' && resource.type !== 'fire' && resource.capacity && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-medium">Capacity:</span> {resource.available_capacity}/{resource.capacity}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full ${
                          (resource.available_capacity / resource.capacity) > 0.5 
                            ? 'bg-green-500' 
                            : (resource.available_capacity / resource.capacity) > 0.2
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((resource.available_capacity / resource.capacity) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <span
                className={`${getStatusBadge(resource.status)} px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap`}
              >
                {resource.status.toUpperCase()}
              </span>
            </div>

            {/* Contact Info */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 flex-wrap">
              <a 
                href={`tel:${resource.contact}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-gray-600 hover:text-primary transition-colors"
              >
                📞 {resource.contact}
              </a>
              {resource.verified && (
                <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                  ✓ Verified
                </span>
              )}
              {resource.helpline && (
                <a 
                  href={`tel:${resource.helpline}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  🚨 {resource.helpline}
                </a>
              )}
            </div>

            {/* Get Directions Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${resource.latitude},${resource.longitude}`,
                  '_blank'
                );
              }}
              className="mt-3 w-full bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              🧭 Get Directions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
