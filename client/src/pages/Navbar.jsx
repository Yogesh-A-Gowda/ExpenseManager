import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userName, setUsername] = useState('')
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const authToken = localStorage.getItem('authToken'); // Retrieve token from local storage or cookies
    
        const response = await axios.get(`${import.meta.env.VITE_api}/user`, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
          }
        });
    
        console.log(response); // Log the entire response
        if (response.data.user && response.data.user.firstname) {
          setUsername(response.data.user.firstname);
        } else {
          setUsername('Guest');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear authentication token
    navigate('/sign-in'); // Redirect to the sign-in page
    setDropdownOpen(false); // Close dropdown
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown after navigation
  const handleNavigate = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 py-4 px-6 shadow-md">
      {/* Logo Section */}
      <div
        className="text-blue-600 text-xl font-bold cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        Yogesh Finance Tracker
      </div>

      {/* Navigation Buttons */}
      <div className="flex-1 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className={`${
            location.pathname === '/dashboard'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          } py-2 px-6 rounded-full hover:bg-blue-600 hover:text-white transition-all`}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/transactions')}
          className={`${
            location.pathname === '/transactions'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          } py-2 px-6 rounded-full hover:bg-blue-600 hover:text-white transition-all`}
        >
          Transaction
        </button>
        <button
          onClick={() => navigate('/accounts')}
          className={`${
            location.pathname === '/accounts'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          } py-2 px-6 rounded-full hover:bg-blue-600 hover:text-white transition-all`}
        >
          Accounts
        </button>
      </div>

      {/* User Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-full hover:bg-blue-600 hover:text-white transition-all"
        >
          {userName ? userName : 'Guest'} {/* Replace with an actual logo/icon */}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
             <button
              onClick={() => handleNavigate('/settings')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
