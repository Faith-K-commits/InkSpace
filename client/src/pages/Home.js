import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import NavBar from '../components/NavBar';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/posts')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error('Expected an array but got:', data);
                    setPosts([]);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setPosts([]);
            });
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <NavBar />
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-16">All Blog Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Home;