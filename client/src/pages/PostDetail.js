import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/posts/resource/${id}`)
    .then(res => res.json())
    .then(data => setPost(data));
  }, [id]);
  if(!post){
    return <div>Post not found</div>
  }
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-4xl mb-4'>{post.title}</h1>
      <p className='text-gray-600'>by {post.user_id} - {post.created_at}</p>
      <div className='mt-6'>
        {post.content}
      </div>
    </div>
  );
};

export default PostDetail;