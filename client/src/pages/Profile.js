import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');

    fetch('https://inkspacebackend-8xbi.onrender.com/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setProfile(data))
      .catch(error => setError(error.message));
  }, []);

  return (
    <div className="container mx-auto p-6 sm:mt-16 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {profile ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Username: {profile.username}</h2>
            <p className="text-gray-600">Email: {profile.email}</p>
          </>
        ) : (
          <p className="text-gray-500">{error || 'Loading...'}</p>
        )}
      </div>

      {profile && profile.posts && (
        <>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.posts.length > 0 ? (
              profile.posts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-gray-500">You have no posts yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const PostCard = ({ post }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h4 className="font-bold text-lg">{post.title}</h4>
    <p className="text-gray-500">{post.content.slice(0, 100)}...</p>
  </div>
);

export default Profile;
