import React from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../images/landing.jpg';
import EasyToUseImage from '../images/blog.jpg';  
import EngageImage from '../images/people.jpg';      
import SecureImage from '../images/secure.jpg';         

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/AuthPage');
  };

  const handleSignup = () => {
    navigate('/AuthPage');
  };

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Optional: Add overlay to improve text visibility */}
      <div className="bg-black bg-opacity-50 flex flex-col flex-grow">
        <header className="bg-white shadow">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold text-blue-600">InkSpace</h1>
            <nav>
              <button 
                onClick={handleLogin} 
                className="text-blue-600 mx-4 hover:text-blue-800"
              >
                Login
              </button>
              <button 
                onClick={handleSignup} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign Up
              </button>
            </nav>
          </div>
        </header>
        
        <main className="container mx-auto p-6 text-center text-white">
          <h2 className="text-3xl font-semibold mb-4">Welcome to InkSpace</h2>
          <p className="mb-8">
            Share your thoughts and ideas with the world. Join a community of writers and readers.
          </p>
          <button 
            onClick={handleSignup} 
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-200"
          >
            Get Started
          </button>
        </main>

        {/* Features and footer at the bottom */}
        <section className="py-8 mt-auto">
          <div className="container mx-auto text-center">
            {/* No background for the Features header */}
            <h2 className="text-2xl font-semibold mb-6 text-white">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                <img 
                  src={EasyToUseImage} 
                  alt="Easy to Use" 
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-xl font-medium mb-2">Easy to Use</h3>
                <p className="text-gray-600">Create and manage your posts with our user-friendly interface.</p>
              </div>

              {/* Card 2 */}
              <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                <img 
                  src={EngageImage} 
                  alt="Engage with Community" 
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-xl font-medium mb-2">Engage with Community</h3>
                <p className="text-gray-600">Comment and connect with other writers and readers.</p>
              </div>

              {/* Card 3 */}
              <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                <img 
                  src={SecureImage} 
                  alt="Secure and Reliable" 
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-xl font-medium mb-2">Secure and Reliable</h3>
                <p className="text-gray-600">Your data is safe with us. We prioritize your privacy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer at the bottom */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} InkSpace. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
