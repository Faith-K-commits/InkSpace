import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('/logout', {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          navigate('/login');
        }
      })
      .catch(() => {
        console.error('Logout failed');
      });
  };

  return (
    <header className="bg-white shadow w-full fixed top-0 left-0 z-10">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">InkSpace</h1>
        <nav className="flex items-center">
        <button 
            onClick={() => navigate('/create')} 
            className="text-blue-600 mx-4 hover:text-blue-800 transition duration-200"
          >
            Create Post
          </button>
          <button 
            onClick={() => navigate('/profile')} 
            className="text-blue-600 mx-4 hover:text-blue-800 transition duration-200"
          >
            Profile
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
