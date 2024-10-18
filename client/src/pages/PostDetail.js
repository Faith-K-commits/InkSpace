import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`/posts/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => setPost(data))
            .catch(error => {
                console.error('Fetch error:', error);
                setPost(null);
            });
    }, [id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            fetch(`/posts/${id}`, {
                method: 'DELETE',
            })
                .then(res => {
                    if (res.ok) {
                        alert('Post deleted successfully');
                        navigate('/posts');
                        alert('Failed to delete the post');
                    }
                })
                .catch(error => {
                    console.error('Delete error:', error);
                });
        }
    };

    const handleEdit = () => {
        navigate(`/posts/edit/${id}`); // Navigate to the edit page
    };

    const handleNext = () => {
        navigate(`/posts/${parseInt(id) + 1}`); // Navigate to the next post
    };

    const handleBack = () => {
        if (parseInt(id) > 1) {
            navigate(`/posts/${parseInt(id) - 1}`); // Navigate to the previous post
        } else {
            navigate('/posts')
        }
    };

    if (!post) {
        return <div className='container mx-auto p-6'>Post not found</div>;
    }

    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className='bg-gray-50 min-h-screen p-6'>
            <div className='container mx-auto bg-white p-8 rounded-lg shadow-lg'>
                <h1 className='text-4xl font-bold mb-4'>{post.title}</h1>
                <p className='text-gray-600 mb-4'>by {post.author.username} - {formattedDate}</p>
                <div className='mt-6 text-gray-800'>
                    {post.content}
                </div>
                
                {/* Categories Section */}
                <div className='mt-6'>
                    <h3 className='text-lg font-semibold mb-2'>Categories:</h3>
                    <ul className='flex flex-wrap space-x-2'>
                        {post.categories && post.categories.map((category, index) => (
                            <li key={index} className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm'>
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Edit and Delete Buttons */}
                <div className='mt-6 flex space-x-4'>
                    <button 
                        onClick={handleEdit} 
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                        Edit
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
                        Delete
                    </button>
                </div>

                {/* Navigation Buttons */}
                <div className='mt-6 flex justify-between'>
                    <button 
                        onClick={handleBack} 
                        className='bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400'>
                        Back
                    </button>
                    <button 
                        onClick={handleNext} 
                        className='bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400'>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
