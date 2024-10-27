// Home.js
import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import NavBar from '../components/NavBar';
import Cookies from 'js-cookie';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const token = Cookies.get('token'); 
        fetch('https://inkspacebackend-8xbi.onrender.com/posts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => Array.isArray(data) ? setPosts(data) : setPosts([]))
            .catch(() => setPosts([]));
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen p-6 text-white">
            <NavBar />
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-100 mb-8 mt-12">
                All Blog Posts
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Home;
