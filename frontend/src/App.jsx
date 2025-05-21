import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Bell, MessageCircle, User, LogOut, X } from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
  };
  
  axios.defaults.baseURL = 'http://localhost:8000/api';
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.user-menu')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
          </Link>
          
          {token ? (
            <>
              <div className="hidden md:flex space-x-2">
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 rounded-full hover:bg-gray-100 font-medium"
                >
                  Dashboard
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="w-6 h-6 text-gray-700" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <MessageCircle className="w-6 h-6 text-gray-700" />
                </button>
                
                <div className="relative user-menu">
                  <button 
                    onClick={toggleMenu} 
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <User className="w-6 h-6 text-gray-700" />
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                      <Link 
                        to="/trash" 
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Trash
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={logout} 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-full hover:bg-gray-100 font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {isBannerVisible && (
        <div className="bg-red-600 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">
                Welcome to Your Photo Storage Hub! Securely store, manage, and share your photos with ease.
              </span>
            </div>
            <button 
              onClick={() => setIsBannerVisible(false)} 
              className="p-1 rounded-full hover:bg-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4">
        <Outlet context={{ token, setToken }} />
      </main>
    </div>
  );
}

export default App;