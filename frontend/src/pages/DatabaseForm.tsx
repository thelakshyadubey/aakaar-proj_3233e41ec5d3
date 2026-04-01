import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabaseById, createDatabase, updateDatabase } from '../api/client';

interface Database {
  id: number;
  name: string;
  connectionString: string;
  username: string;
  password: string;
  host: string;
  port: number;
  createdAt: string;
}

interface DatabaseFormData {
  name: string;
  connectionString: string;
  username: string;
  password: string;
  host: string;
  port: number;
}

const DatabaseForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DatabaseFormData>({
    name: '',
    connectionString: '',
    username: '',
    password: '',
    host: '',
    port: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(!!id);

  useEffect(() => {
    if (isEdit && id) {
      const fetchDatabase = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getDatabaseById(Number(id));
          setFormData({
            name: data.name,
            connectionString: data.connectionString,
            username: data.username,
            password: data.password,
            host: data.host,
            port: data.port,
          });
        } catch (err) {
          setError('Failed to load database');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDatabase();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEdit && id) {
        await updateDatabase(Number(id), formData);
      } else {
        await createDatabase(formData);
      }
      navigate('/databases');
    } catch (err) {
      setError('Failed to save database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Database' : 'Add New Database'}</h1>
      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Connection String</label>
          <input
            type="text"
            name="connectionString"
            value={formData.connectionString}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Host</label>
          <input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Port</label>
          <input
            type="number"
            name="port"
            value={formData.port}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/databases')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DatabaseForm;