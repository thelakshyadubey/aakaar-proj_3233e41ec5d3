import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabases, deleteDatabase } from '../api/client';

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

const DatabaseList: React.FC = () => {
  const [items, setItems] = useState<Database[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  const fetchDatabases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDatabases();
      setItems(data);
    } catch (err) {
      setError('Failed to load databases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this database?')) {
      try {
        await deleteDatabase(id);
        fetchDatabases();
      } catch (err) {
        setError('Failed to delete database');
        console.error(err);
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.connectionString.toLowerCase().includes(search.toLowerCase()) ||
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[20rem] items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-t-2 border-b-2 border-blue-500 w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold mr-auto">Databases</h1>
        <button
          onClick={() => navigate('/database/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search databases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500">No databases found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Connection String</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Password</th>
              <th className="p-4 text-left">Host</th>
              <th className="p-4 text-left">Port</th>
              <th className="p-4 text-left">Created At</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((db) => (
              <tr key={db.id} className="border-t">
                <td className="p-4">{db.id}</td>
                <td className="p-4">{db.name}</td>
                <td className="p-4 break-all">{db.connectionString}</td>
                <td className="p-4">{db.username}</td>
                <td className="p-4">{db.password}</td>
                <td className="p-4">{db.host}</td>
                <td className="p-4">{db.port}</td>
                <td className="p-4">{new Date(db.createdAt).toLocaleString()}</td>
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/database/${db.id}/edit`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(db.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DatabaseList;