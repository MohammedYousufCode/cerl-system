import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import resourceService from '../services/resourceService';
import alertService from '../services/alertService';
import authService from '../services/authService';
import MapPicker from '../components/admin/MapPicker';
import jsPDF from 'jspdf';

const AdminDashboard = () => {
  const [resources, setResources] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [editingResource, setEditingResource] = useState(null);
  const [editCoords, setEditCoords] = useState({ lat: null, lon: null });
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    severity: 'medium',
    region: '',
    expires_at: '',
  });
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'hospital',
    status: 'open',
    latitude: '',
    longitude: '',
    region: '',
    address: '',
    capacity: '',
    available_capacity: '',
    contact: '',
    helpline: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Load data in parallel but limit resource updates to 10 for performance
      const [resList, alertList, userList, statsData, updatesData] = await Promise.all([
        resourceService.getAllResources(),
        alertService.getAllAlerts(),
        authService.getAllUsers(),
        resourceService.getStats(),
        resourceService.getResourceUpdates(null, 10), // Limit to 10 updates
      ]);
      
      // Services now handle pagination, so data is already arrays
      setResources(resList || []);
      setAlerts(alertList || []);
      setUsers(userList || []);
      setStats(statsData);
      setUpdates(updatesData || []);
    } catch (err) {
      console.error('Admin dashboard load error:', err);
      setError('Failed to load admin data: ' + (err.response?.data?.error || err.message));
      // Set empty arrays on error to prevent crashes
      setResources([]);
      setAlerts([]);
      setUsers([]);
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await resourceService.verifyResource(id);
      await loadData();
    } catch (err) {
      alert('Verify failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await alertService.createAlert(newAlert);
      setNewAlert({ title: '', description: '', severity: 'medium', region: '', expires_at: '' });
      await loadData();
    } catch (err) {
      alert('Create alert failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleApproveUser = async (id) => {
    try {
      await authService.approveUser(id);
      await loadData();
    } catch (err) {
      alert('Approve failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleAssignCoordinator = async (resourceId, coordinatorId) => {
    if (!coordinatorId) return;
    try {
      await resourceService.assignCoordinator(resourceId, coordinatorId);
      await loadData();
    } catch (err) {
      alert('Assign failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await authService.updateUser(userId, { role });
      await loadData();
    } catch (err) {
      alert('Role update failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newResource).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });
    try {
      await resourceService.createResourceForm(formData);
      setNewResource({
        name: '',
        type: 'hospital',
        status: 'open',
        latitude: '',
        longitude: '',
        region: '',
        address: '',
        capacity: '',
        available_capacity: '',
        contact: '',
        helpline: '',
        description: '',
        image: null,
      });
      await loadData();
    } catch (err) {
      alert('Resource submission failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleExport = async () => {
    try {
      const blob = await resourceService.exportResourcesCsv();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resources.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Export failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const startY = 20;
      let yPos = startY;

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('CERL System - Resources Report', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generated on: ${date}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      // Stats summary
      if (stats) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary', margin, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Resources: ${stats.total_resources}`, margin, yPos);
        yPos += 6;
        doc.text(`Verified Resources: ${stats.verified_resources}`, margin, yPos);
        yPos += 6;
        
        if (stats.by_type && stats.by_type.length > 0) {
          doc.text('By Type:', margin, yPos);
          yPos += 6;
          stats.by_type.forEach(type => {
            doc.text(`  • ${type.type.charAt(0).toUpperCase() + type.type.slice(1)}: ${type.count}`, margin + 5, yPos);
            yPos += 5;
          });
        }
        yPos += 5;
      }

      // Resources table header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Resources List', margin, yPos);
      yPos += 8;

      // Table headers
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const colWidths = [30, 25, 20, 25, 30, 25, 35];
      const headers = ['Name', 'Type', 'Status', 'Region', 'Capacity', 'Verified', 'Contact'];
      let xPos = margin;
      
      headers.forEach((header, index) => {
        doc.text(header, xPos, yPos);
        xPos += colWidths[index];
      });
      yPos += 6;

      // Draw line under header
      doc.setLineWidth(0.5);
      doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
      yPos += 3;

      // Resources data
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      resources.forEach((resource, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = startY;
          
          // Redraw header on new page
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          xPos = margin;
          headers.forEach((header, idx) => {
            doc.text(header, xPos, yPos);
            xPos += colWidths[idx];
          });
          yPos += 6;
          doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
          yPos += 3;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
        }

        xPos = margin;
        const rowData = [
          resource.name.substring(0, 20) + (resource.name.length > 20 ? '...' : ''),
          resource.type.charAt(0).toUpperCase() + resource.type.slice(1),
          resource.status.toUpperCase(),
          resource.region || 'N/A',
          `${resource.available_capacity}/${resource.capacity}`,
          resource.verified ? 'Yes' : 'No',
          resource.contact || 'N/A'
        ];

        rowData.forEach((data, idx) => {
          doc.text(data, xPos, yPos);
          xPos += colWidths[idx];
        });
        yPos += 6;

        // Add a subtle line between rows (every 5 rows)
        if ((index + 1) % 5 === 0 && index < resources.length - 1) {
          doc.setLineWidth(0.1);
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPos - 1, pageWidth - margin, yPos - 1);
          doc.setDrawColor(0, 0, 0);
          yPos += 2;
        }
      });

      // Footer
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(
          `Page ${i} of ${totalPages} - CERL Emergency Resource Locator`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      doc.save(`cerl-resources-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('PDF export failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEditLocation = (resource) => {
    setEditingResource(resource);
    setEditCoords({ lat: parseFloat(resource.latitude), lon: parseFloat(resource.longitude) });
  };

  const handleUpdateCoordinates = async () => {
    if (!editingResource || !editCoords.lat || !editCoords.lon) return;
    try {
      await resourceService.updateResource(editingResource.id, {
        latitude: editCoords.lat,
        longitude: editCoords.lon,
      });
      setEditingResource(null);
      setEditCoords({ lat: null, lon: null });
      await loadData();
      alert('Coordinates updated successfully!');
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
            <h1 className="text-2xl font-bold text-gray-900">System Control</h1>
          </div>
          <Link to="/" className="text-primary hover:underline text-sm">
            ← Back to map
          </Link>
        </div>

        {error && <div className="mb-4 rounded bg-red-50 text-red-700 px-4 py-2">{error}</div>}

        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            {stats && (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Total Resources</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_resources}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Verified</p>
                  <p className="text-2xl font-bold text-green-700">{stats.verified_resources}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500">By Type</p>
                  <p className="text-sm text-gray-800">
                    {stats.by_type.map((t) => `${t.type}: ${t.count}`).join(', ')}
                  </p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500">By Status</p>
                  <p className="text-sm text-gray-800">
                    {stats.by_status.map((s) => `${s.status}: ${s.count}`).join(', ')}
                  </p>
                </div>
              </section>
            )}

            {/* Users */}
            <section className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                <span className="text-sm text-gray-500">{users.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-3">Username</th>
                      <th className="py-2 pr-3">Role</th>
                      <th className="py-2 pr-3">Approved</th>
                      <th className="py-2 pr-3">Phone</th>
                      <th className="py-2 pr-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-2 pr-3">{u.username}</td>
                        <td className="py-2 pr-3 capitalize">
                          <select
                            defaultValue={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="border rounded px-2 py-1 text-xs"
                          >
                            <option value="citizen">Citizen</option>
                            <option value="coordinator">Coordinator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-2 pr-3">
                          {u.is_approved ? (
                            <span className="text-green-600 font-semibold">Yes</span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td className="py-2 pr-3">{u.phone_number || '-'}</td>
                        <td className="py-2 pr-3 text-right">
                          {!u.is_approved && (
                            <button
                              onClick={() => handleApproveUser(u.id)}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Resource Verification */}
            <section className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
                <span className="text-sm text-gray-500">{resources.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-3">Name</th>
                      <th className="py-2 pr-3">Type</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">Verified</th>
                      <th className="py-2 pr-3">Coordinator</th>
                      <th className="py-2 pr-3">Region</th>
                      <th className="py-2 pr-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2 pr-3">{r.name}</td>
                        <td className="py-2 pr-3 capitalize">{r.type}</td>
                        <td className="py-2 pr-3 uppercase text-xs font-semibold">{r.status}</td>
                        <td className="py-2 pr-3">
                          {r.verified ? (
                            <span className="text-green-600 font-semibold">Yes</span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td className="py-2 pr-3">
                          <select
                            defaultValue={r.coordinator}
                            onChange={(e) => handleAssignCoordinator(r.id, e.target.value)}
                            className="border rounded px-2 py-1 text-xs"
                          >
                            <option value="">Unassigned</option>
                            {users
                              .filter((u) => u.role === 'coordinator' && u.is_approved)
                              .map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.username}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="py-2 pr-3">{r.region}</td>
                        <td className="py-2 pr-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleEditLocation(r)}
                              className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                              title="Edit location coordinates"
                            >
                              📍 Edit Location
                            </button>
                            {!r.verified && (
                              <button
                                onClick={() => handleVerify(r.id)}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleExport}
                  className="text-xs bg-gray-800 text-white px-3 py-2 rounded hover:bg-black"
                >
                  📄 Export CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  className="text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  📑 Export PDF
                </button>
              </div>
            </section>

            {/* Submit Resource */}
            <section className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Submit Resource</h2>
              <form onSubmit={handleResourceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded px-3 py-2" placeholder="Name" required value={newResource.name} onChange={(e) => setNewResource({ ...newResource, name: e.target.value })} />
                <select className="border rounded px-3 py-2" value={newResource.type} onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}>
                  <option value="hospital">Hospital</option>
                  <option value="police">Police</option>
                  <option value="fire">Fire</option>
                  <option value="shelter">Shelter</option>
                  <option value="food">Food</option>
                  <option value="water">Water</option>
                </select>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (Click map to select)</label>
                  <MapPicker
                    initialLat={newResource.latitude ? parseFloat(newResource.latitude) : null}
                    initialLon={newResource.longitude ? parseFloat(newResource.longitude) : null}
                    onLocationChange={(lat, lon) => {
                      setNewResource({ ...newResource, latitude: lat.toString(), longitude: lon.toString() });
                    }}
                    height="300px"
                  />
                </div>
                <input className="border rounded px-3 py-2" placeholder="Region" required value={newResource.region} onChange={(e) => setNewResource({ ...newResource, region: e.target.value })} />
                <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Address" required value={newResource.address} onChange={(e) => setNewResource({ ...newResource, address: e.target.value })} />
                <input type="number" className="border rounded px-3 py-2" placeholder="Capacity" value={newResource.capacity} onChange={(e) => setNewResource({ ...newResource, capacity: e.target.value })} />
                <input type="number" className="border rounded px-3 py-2" placeholder="Available Capacity" value={newResource.available_capacity} onChange={(e) => setNewResource({ ...newResource, available_capacity: e.target.value })} />
                <input className="border rounded px-3 py-2" placeholder="Contact" value={newResource.contact} onChange={(e) => setNewResource({ ...newResource, contact: e.target.value })} />
                <input className="border rounded px-3 py-2" placeholder="Helpline" value={newResource.helpline} onChange={(e) => setNewResource({ ...newResource, helpline: e.target.value })} />
                <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Description" value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} />
                <input type="file" accept="image/*" className="border rounded px-3 py-2 md:col-span-2" onChange={(e) => setNewResource({ ...newResource, image: e.target.files[0] })} />
                <button type="submit" className="md:col-span-2 bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
                  Submit Resource
                </button>
              </form>
            </section>

            {/* Alerts */}
            <section className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Alerts</h2>
              <form onSubmit={handleCreateAlert} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Title"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  required
                />
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Region"
                  value={newAlert.region}
                  onChange={(e) => setNewAlert({ ...newAlert, region: e.target.value })}
                />
                <select
                  className="border rounded-lg px-3 py-2"
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input
                  type="datetime-local"
                  className="border rounded-lg px-3 py-2"
                  value={newAlert.expires_at}
                  onChange={(e) => setNewAlert({ ...newAlert, expires_at: e.target.value })}
                />
                <textarea
                  className="border rounded-lg px-3 py-2 md:col-span-2"
                  placeholder="Description"
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="md:col-span-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Create Alert
                </button>
              </form>

              <div className="space-y-3">
                {alerts.map((a) => (
                  <div key={a.id} className="border rounded-lg p-3 flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase text-gray-500">{a.severity}</p>
                      <h3 className="font-semibold text-gray-900">{a.title}</h3>
                      <p className="text-sm text-gray-700">{a.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Region: {a.region || 'All'}</p>
                    </div>
                    {a.is_active ? (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Active</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Inactive</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Log */}
            <section className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
                <span className="text-sm text-gray-500">Latest 10 capacity/assignment updates</span>
              </div>
              <div className="space-y-2">
                {updates.map((u) => (
                  <div key={u.id} className="border rounded-lg px-3 py-2 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{u.resource_name}</p>
                      <p className="text-xs text-gray-600">{u.change_log}</p>
                      <p className="text-xs text-gray-500">
                        Prev: {u.previous_capacity} → New: {u.new_capacity}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{u.coordinator_name}</div>
                      <div>{new Date(u.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Edit Location Modal */}
        {editingResource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Edit Location: {editingResource.name}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingResource(null);
                      setEditCoords({ lat: null, lon: null });
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Click on the map or enter coordinates manually to update the resource location.
                  </p>
                  <MapPicker
                    initialLat={editCoords.lat}
                    initialLon={editCoords.lon}
                    onLocationChange={(lat, lon) => setEditCoords({ lat, lon })}
                    height="400px"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleUpdateCoordinates}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
                  >
                    Update Coordinates
                  </button>
                  <button
                    onClick={() => {
                      setEditingResource(null);
                      setEditCoords({ lat: null, lon: null });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

