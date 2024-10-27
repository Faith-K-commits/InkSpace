import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Cookies from 'js-cookie';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');

    fetch(`https://inkspacebackend-8xbi.onrender.com/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(error => console.error('Error fetching data:', error));

    fetch(`https://inkspacebackend-8xbi.onrender.com/comments/posts/${id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error));
  }, [id]);

  if (!post) {
    return <div className="container mx-auto p-6">Loading</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-4">by {post.author?.username || 'Unknown'}</p>
        <div className="mt-6 text-gray-800">
          {post.content}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Comments:</h3>
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="bg-gray-100 p-4 mb-4 rounded-lg">
                <p className="text-gray-800 mb-1">{comment.content}</p>
                <p className="text-sm text-gray-600">by {comment.author?.username || 'Unknown'}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
