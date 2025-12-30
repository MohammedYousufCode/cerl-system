import { useState, useEffect } from 'react';

const SearchFilters = ({ onFilterChange, userLocation }) => {
  const [filters, setFilters] = useState({
    type: '',
    status: '',  // CHANGED: Empty by default instead of 'full'
    maxDistance: 10,
    search: '',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h3 className="font-bold text-lg text-gray-800">Filters</h3>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search resources..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Resource Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resource Type
        </label>
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Types</option>
          <option value="hospital">Hospital</option>
          <option value="police">Police Station</option>
          <option value="fire">Fire Station</option>
          <option value="shelter">Shelter</option>
          <option value="food">Food Center</option>
          <option value="water">Water Point</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="full">Full</option>
        </select>
      </div>

      {/* Distance Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Distance: {filters.maxDistance} km
        </label>
        <input
          type="range"
          name="maxDistance"
          min="1"
          max="50"
          value={filters.maxDistance}
          onChange={handleChange}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 km</span>
          <span>50 km</span>
        </div>
      </div>

      {/* User Location Status */}
      {userLocation ? (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          Location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
        </div>
      ) : (
        <div className="text-xs text-gray-500">Detecting location...</div>
      )}
    </div>
  );
};

export default SearchFilters;
