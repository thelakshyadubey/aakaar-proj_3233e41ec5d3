import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFrontends, deleteFrontend } from '../api/client';

interface Frontend {
  id: number;
  framework: string;
  language: string;
  styling: string;
  stateMgmt: string;
  createdAt: string;
}

const FrontendList: React.FC = () => {
  const [items, setItems] = useState<Frontend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  const fetchFrontends = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFrontends();
      setItems(data);
    } catch (err) {
      setError('Failed to load frontends');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrontends();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this frontend?')) {
      try {
        await deleteFrontend(id);
        fetchFrontends();
      } catch (err) {
        setError('Failed to delete frontend');
        console.error(err);
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.framework.toLowerCase().includes(search.toLowerCase()) ||
    item.language.toLowerCase().includes(search.toLowerCase()) ||
    item.styling.toLowerCase().includes(search.toLowerCase()) ||
    item.stateMgmt.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold mr-auto">Frontends</h1>
        <button
          onClick={() => navigate('/frontend/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New
        </button>
      </div>

      <div className="mb-4">
        <input