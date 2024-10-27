import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://inkspacebackend-8xbi.onrender.com/posts/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                toast.error('Failed to fetch post.');
                setLoading(false);
            });
    }, [id]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        content: Yup.string().required('Content is required'),
        categories: Yup.string().required('At least one category is required'),
    });

    if (loading) {
        return <div className='container mx-auto p-6 text-gray-300'>Loading...</div>;
    }

    const handleSubmit = (values) => {
        const token = Cookies.get('token');

        fetch(`https://inkspacebackend-8xbi.onrender.com/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: values.title,
                content: values.content,
                categories: values.categories.split(',').map(cat => cat.trim()),
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(() => {
                toast.success('Post updated successfully!');
                setTimeout(() => navigate(`/posts/${id}`), 1000);
            })
            .catch(error => {
                console.error('Error updating post:', error);
                toast.error('Failed to update post.');
            });
    };

    const handleCancel = () => {
        navigate(`/posts/${id}`);
    };

    return (
        <div className='bg-gray-900 min-h-screen p-6 text-gray-300'>
            <ToastContainer />
            <div className='container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg'>
                <h1 className='text-4xl font-bold mb-4 text-gray-100'>Edit Post</h1>
                <Formik
                    initialValues={{
                        title: post.title,
                        content: post.content,
                        categories: post.categories.map(category => category.name).join(', '),
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className='mt-4'>
                            <div className='mb-4'>
                                <label className='block text-gray-400 text-sm font-semibold mb-2' htmlFor='title'>
                                    Title
                                </label>
                                <Field
                                    className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-200'
                                    type='text'
                                    name='title'
                                />
                                <ErrorMessage name='title' component='div' className='text-red-500 text-xs italic' />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-400 text-sm font-semibold mb-2' htmlFor='content'>
                                    Content
                                </label>
                                <Field
                                    as='textarea'
                                    className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-200 resize-none h-64'
                                    name='content'
                                />
                                <ErrorMessage name='content' component='div' className='text-red-500 text-xs italic' />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-400 text-sm font-semibold mb-2'>Categories</label>
                                <Field
                                    className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-200'
                                    type='text'
                                    name='categories'
                                />
                                <p className='text-gray-500 text-xs italic'>Enter categories separated by commas.</p>
                                <ErrorMessage name='categories' component='div' className='text-red-500 text-xs italic' />
                            </div>
                            <div className='flex flex-col sm:flex-row justify-between mt-6'>
                                <button
                                    className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-2 sm:mb-0 sm:mr-2'
                                    type='submit'
                                    disabled={isSubmitting}
                                >
                                    Update Post
                                </button>
                                <button
                                    type='button'
                                    onClick={handleCancel}
                                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditPost;
