import { useState } from 'react';
import { Link } from 'react-router-dom';
import resourceService from '../services/resourceService';

const ResourceSubmitPage = () => {
  const [form, setForm] = useState({
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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((p) => ({ ...p, [name]: files[0] }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== '') data.append(k, v);
    });
    try {
      await resourceService.createResourceForm(data);
      setMessage('Submitted for approval.');
      setForm({
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
    } catch (err) {
      setMessage(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Submit Resource</p>
            <h1 className="text-2xl font-bold text-gray-900">Add a new emergency resource</h1>
          </div>
          <Link to="/" className="text-primary hover:underline text-sm">
            ← Back to map
          </Link>
        </div>

        {message && <div className="mb-4 bg-blue-50 text-blue-700 px-4 py-2 rounded">{message}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded-xl shadow border border-gray-100">
          <input name="name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Name" required />
          <select name="type" value={form.type} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="hospital">Hospital</option>
            <option value="police">Police</option>
            <option value="fire">Fire</option>
            <option value="shelter">Shelter</option>
            <option value="food">Food</option>
            <option value="water">Water</option>
          </select>
          <input name="latitude" value={form.latitude} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Latitude" required />
          <input name="longitude" value={form.longitude} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Longitude" required />
          <input name="region" value={form.region} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Region" required />
          <select name="status" value={form.status} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="full">Full</option>
          </select>
          <input name="capacity" type="number" value={form.capacity} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Capacity" />
          <input name="available_capacity" type="number" value={form.available_capacity} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Available Capacity" />
          <input name="contact" value={form.contact} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Contact" />
          <input name="helpline" value={form.helpline} onChange={handleChange} className="border rounded px-3 py-2" placeholder="Helpline" />
          <input name="address" value={form.address} onChange={handleChange} className="border rounded px-3 py-2 md:col-span-2" placeholder="Address" required />
          <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-3 py-2 md:col-span-2" placeholder="Description" />
          <input name="image" type="file" accept="image/*" onChange={handleChange} className="border rounded px-3 py-2 md:col-span-2" />
          <button type="submit" disabled={submitting} className="md:col-span-2 bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Resource'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResourceSubmitPage;

