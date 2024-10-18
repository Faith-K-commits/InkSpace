import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const Signup = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',  
      email: '',
      password: '',
    },
    onSubmit: values => {
      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username, 
          email: values.email,
          password: values.password,
        }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            setError(data.message || 'Sign-up failed');
            throw new Error('Sign-up failed');
          });
        }
        return response.json();
      })
      .then(data => {
        // Store token in cookies if the response includes it
        if (data.token) {
          Cookies.set('token', data.token, { expires: 7 }); 
          navigate('/posts'); 
        } else {
          setError('Sign-up failed');
        }
      })
      .catch(error => {
        if (error.message === 'Sign-up failed') {
          setError('User already exists');
        } else {
          setError('Error signing up');
        }
      });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Sign Up</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <input
              id="username"  
              name="username" 
              type="text"
              onChange={formik.handleChange}
              value={formik.values.username} 
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition duration-200">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
