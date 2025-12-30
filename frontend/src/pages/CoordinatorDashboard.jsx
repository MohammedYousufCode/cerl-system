import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import resourceService from '../services/resourceService';

const CoordinatorDashboard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    setError('');
    try {
      // Only load resources assigned to current coordinator
      // Backend automatically filters by coordinator when role is coordinator
      // Service handles pagination, returns array directly
      const data = await resourceService.getAllResources();
      setResources(data || []);
    } catch (err) {
      setError('Failed to load resources: ' + (err.response?.data?.error || err.message));
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCapacity = async (resourceId, available_capacity) => {
    setUpdatingId(resourceId);
    try {
      await resourceService.updateCapacity(resourceId, Number(available_capacity), 'Coordinator update');
      await loadResources();
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Coordinator Panel</p>
            <h1 className="text-2xl font-bold text-gray-900">Manage Assigned Resources</h1>
          </div>
          <Link to="/" className="text-primary hover:underline text-sm">
            ← Back to map
          </Link>
        </div>

        {error && <div className="mb-4 rounded bg-red-50 text-red-700 px-4 py-2">{error}</div>}

        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {resources.map((r) => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-gray-500">{r.type}</p>
                    <h3 className="text-lg font-semibold text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-600">{r.address}</p>
                    <p className="text-xs text-gray-500 mt-1">Region: {r.region}</p>
                    <p className="text-sm text-gray-700 mt-2">
                      Status: <span className="font-semibold uppercase">{r.status}</span>
                    </p>
                    {r.coordinator_name && (
                      <p className="text-xs text-gray-500 mt-1">Coordinator: {r.coordinator_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Capacity: <span className="font-semibold">{r.available_capacity}</span> / {r.capacity}
                    </p>
                    <input
                      type="number"
                      min="0"
                      defaultValue={r.available_capacity}
                      className="mt-2 w-28 border rounded px-2 py-1 text-sm"
                      onChange={(e) => {
                        const val = e.target.value;
                        setResources((prev) =>
                          prev.map((item) => (item.id === r.id ? { ...item, draft_capacity: val } : item))
                        );
                      }}
                    />
                    <button
                      disabled={updatingId === r.id}
                      onClick={() => handleUpdateCapacity(r.id, r.draft_capacity ?? r.available_capacity)}
                      className="mt-2 w-full bg-primary text-white text-xs font-semibold px-3 py-2 rounded hover:bg-blue-600 disabled:opacity-60"
                    >
                      {updatingId === r.id ? 'Updating...' : 'Update Capacity'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorDashboard;

