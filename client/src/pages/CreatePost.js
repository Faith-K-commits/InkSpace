import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validate = values => {
  const errors = {};
  if (!values.title) {
    errors.title = 'Title is required';
  }
  if (!values.content) {
    errors.content = 'Content is required';
  }
  return errors;
};

const CreatePost = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(['']); 

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    validate,
    onSubmit: values => {
      // Combine form values with categories
      const postData = {
        ...values,
        categories: categories.filter(category => category !== ''), 
      };
      
      fetch('/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Post created:', data);
        toast.success('Post created successfully!');
        navigate('/posts');
      })
      .catch(error => toast.error('Failed to create post.'));
    },
  });

  // Handle adding a new category input field
  const addCategoryField = () => {
    setCategories([...categories, '']);
  };

  // Handle changing category input values
  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleCancel = () => {
    formik.resetForm();
    setCategories(['']);
    navigate('/posts')
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Post</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {formik.errors.title ? <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div> : null}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-medium">Content</label>
            <textarea
              id="content"
              name="content"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.content}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {formik.errors.content ? <div className="text-red-500 text-sm mt-1">{formik.errors.content}</div> : null}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Categories</label>
            {categories.map((category, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={category}
                  onChange={e => handleCategoryChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter a category"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addCategoryField}
              className="text-blue-500 underline hover:text-blue-600"
            >
              Add Another Category
            </button>
          </div>

          <div className="flex justify-between">
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Create Post
            </button>
            <button 
              type="button" 
              onClick={handleCancel} 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
