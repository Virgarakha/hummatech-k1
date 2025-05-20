import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
  };

  axios.defaults.baseURL = 'http://localhost:8000/api';
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between">
          <Link to="/dashboard" className="text-lg font-bold">Photo App</Link>
          {token ? (
            <div>
              <Link to="/dashboard" className="mr-4">Dashboard</Link>
              <Link to="/trash" className="mr-4">Trash</Link>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <Outlet context={{ token, setToken }} />
      </div>
    </div>
  );
}

export default App;