// PostCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const handleClickPost = () => navigate(`/posts/${post.id}`);
    
    const excerpt = post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '');
    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-gray-800 text-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105">
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                    {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    by {post.author?.username || 'Unknown Author'} - {formattedDate}
                </p>
                <p className="text-gray-300">
                    {excerpt}
                </p>
                <button onClick={handleClickPost} className="mt-4 text-blue-400 hover:underline">
                    Read More
                </button>
            </div>
            <div className="bg-gray-900 px-6 py-3">
                <h3 className="text-sm font-semibold text-gray-300">Categories:</h3>
                <ul className="flex flex-wrap space-x-2 mt-1">
                    {post.categories?.map((category, index) => (
                        <li key={index} className="text-xs text-blue-400 bg-blue-900 px-2 py-1 rounded-full mb-1">
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PostCard;
