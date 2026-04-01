=== frontend/src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import DatabaseList from '../pages/DatabaseList';
import DatabaseForm from '../pages/DatabaseForm';
import FrontendList from '../pages/FrontendList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/databases" element={<DatabaseList />} />
            <Route path="/databases/new" element={<DatabaseForm />} />
            <Route path="/frontend" element={<FrontendList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
=== frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
=== frontend/src/components/Navbar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 shadow-sm dark:bg-gray-800">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <div className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Notes App
          </span>
        </div>
        <div className="block lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div
          className={`hidden w-full md:block md:w-auto lg:block ${isOpen ? 'block' : 'hidden'}`}
          id="mobile-menu"
        >
          <nav className="mt-1 flex flex-col items-center px-1 pt-1 border-t border-gray-100 dark:border-gray-700 lg:flex-row lg:space-x-8 lg:mt-0 lg:border-t-0 lg:pt-0">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `${isActive
                      ? 'bg-gray-100 text-gray-900 rounded px-3 py-2 text-sm font-medium dark:bg-gray-700 dark:text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-600 dark:hover:text-white rounded px-3 py-2 text-sm font-medium'}`}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/databases"
                  end
                  className={({ isActive }) =>
                    `${isActive
                      ? 'bg-gray-100 text-gray-900 rounded px-3 py-2 text-sm font-medium dark:bg-gray-700 dark:text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-600 dark:hover:text-white rounded px-3 py-2 text-sm font-medium'}`}
                >
                  Databases
                </NavLink>
                <NavLink
                  to="/frontend"
                  end
                  className={({ isActive }) =>
                    `${isActive
                      ? 'bg-gray-100 text-gray-900 rounded px-3 py-2 text-sm font-medium dark:bg-gray-700 dark:text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-600 dark:hover:text-white rounded px-3 py-2 text-sm font-medium'}`}
                >
                  Frontend
                </NavLink>
                <button
                  onClickn