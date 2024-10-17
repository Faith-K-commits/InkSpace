import React from 'react';
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate()

  const handleClickPost = () => {
    navigate(`/posts/${post.id}`)
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg'>
      <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
      <p className='text-gray-600'>by{post.user} - {post.date}</p>
      <p className='mt-4'>{post.excerpt}</p>
      <button onClick={handleClickPost} className='text-blue-500 hover:underline mt-4 block'>Read More</button>
    </div>
  );
};

export default PostCard;