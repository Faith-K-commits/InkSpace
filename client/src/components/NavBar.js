import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies
  
    fetch('https://inkspacebackend-8xbi.onrender.com/profile', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          setUsername(data.username);
        }
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, []);
  

  // Handle user logout
  const handleLogout = () => {
    const token = Cookies.get('token'); 
  
    fetch('https://inkspacebackend-8xbi.onrender.com/auth/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      credentials: 'include', 
    })
      .then(response => {
        if (response.ok) {
          Cookies.remove('token');
          navigate('/'); // Navigate to home page after logging out
        } else {
          console.error('Logout failed with status:', response.status);
        }
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <header className="bg-white shadow w-full fixed top-0 left-0 z-10">
      <div className="flex justify-between items-center p-4 flex-wrap">
        <h1
          onClick={() => navigate('/posts')}
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          InkSpace
        </h1>
        <nav className="flex items-center flex-wrap mt-2 md:mt-0">
          {username && (
            <span className="text-gray-700 mr-4">
              Hello, <strong>{username}</strong>
            </span>
          )}
          <button 
            onClick={() => navigate('/create')} 
            className="text-blue-600 mx-2 md:mx-4 hover:text-blue-800 transition duration-200"
          >
            Create Post
          </button>
          <button 
            onClick={() => navigate('/profile')} 
            className="text-blue-600 mx-2 md:mx-4 hover:text-blue-800 transition duration-200"
          >
            Your profile
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 mt-2 md:mt-0"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;