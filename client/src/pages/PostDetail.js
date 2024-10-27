import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { handleDelete } from './HandleDelete';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = Cookies.get('token');
        
        fetch(`https://inkspacebackend-8xbi.onrender.com/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                return fetch('https://inkspacebackend-8xbi.onrender.com/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    setUserId(data.id);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        fetch(`https://inkspacebackend-8xbi.onrender.com/comments/posts/${id}/comments`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(error => console.error('Error fetching comments:', error));
    }, [id]);

    const handleEdit = () => {
        navigate(`/posts/edit/${id}`);
    };

    const handleNext = () => {
        navigate(`/posts/${parseInt(id) + 1}`);
    };

    const handleBack = () => {
        if (parseInt(id) > 1) {
            navigate(`/posts/${parseInt(id) - 1}`);
        } else {
            navigate('/posts');
        }
    };

    const initialValues = { content: '' };

    const validationSchema = Yup.object({
        content: Yup.string()
            .required('Comment is required')
            .min(1, 'Comment must be at least 1 character long')
            .max(500, 'Comment cannot exceed 500 characters'),
    });

    const handleCommentSubmit = (values, { resetForm }) => {
        const token = Cookies.get('token');
        fetch(`https://inkspacebackend-8xbi.onrender.com/comments/posts/${id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content: values.content, author_id: userId }),
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Failed to add comment');
            })
            .then(data => {
                setComments([...comments, data]);
                resetForm();
            })
            .catch(error => {
                console.error('Error adding comment:', error);
            });
    };

    if (!post) {
        return <div className='container mx-auto p-6 text-gray-300'>Post not found</div>;
    }

    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className='bg-gray-900 min-h-screen p-6 text-gray-300'>
            <ToastContainer />
            <div className='container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg'>
                <h1 className='text-4xl font-bold mb-4 text-gray-100'>{post.title}</h1>
                <p className='text-gray-400 mb-4'>by {post.author?.username || 'Unknown'} - {formattedDate}</p>
                <div className='mt-6 text-gray-300'>
                    {post.content}
                </div>
                <div className='mt-6'>
                    <h3 className='text-lg font-semibold mb-2 text-gray-200'>Categories:</h3>
                    <ul className='flex flex-wrap space-x-2'>
                        {post.categories && post.categories.map((category, index) => (
                            <li key={index} className='bg-indigo-700 text-gray-100 px-3 py-1 rounded-full text-sm'>
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
                {userId === post?.author?.id && (
                    <div className='mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
                        <button 
                            onClick={handleEdit} 
                            className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700'>
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(id, navigate)} 
                            className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'>
                            Delete
                        </button>
                    </div>
                )}

                <div className='mt-6 flex justify-between'>
                    <button 
                        onClick={handleBack} 
                        className='bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600'>
                        Back
                    </button>
                    <button 
                        onClick={handleNext} 
                        className='bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600'>
                        Next
                    </button>
                </div>
                <div className='mt-8'>
                    <h3 className='text-lg font-semibold mb-2 text-gray-200'>Comments:</h3>
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className='bg-gray-700 p-4 mb-4 rounded-lg'>
                                <p className='text-gray-200 mb-1'>{comment.content}</p>
                                <p className='text-sm text-gray-400'>
                                    by {comment.author?.username || 'Unknown'} - {comment.created_at ? new Date(comment.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }) : 'Unknown date'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500'>No comments yet. Be the first to comment!</p>
                    )}
                </div>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleCommentSubmit}>
                    <Form className='mt-4'>
                        <Field
                            name='content'
                            as='textarea'
                            placeholder='Write your comment...'
                            className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-200 resize-none'
                        />
                        <ErrorMessage name='content' component='div' className='text-red-500 text-sm' />
                        <button type='submit' className='bg-indigo-600 text-white px-4 py-2 rounded mt-2 hover:bg-indigo-700'>
                            Submit Comment
                        </button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default PostDetail;
