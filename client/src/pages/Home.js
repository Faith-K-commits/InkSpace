import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import NavBar from '../components/NavBar';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/posts')
        .then(res => res.json())
        .then(data => setPosts(data));
    }, [])
  return (
    <div className='container mx-auto p-6'>
        <NavBar />
        <h1 className='text-3xl mb-4'>All Blog Posts</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map(post => (
                <PostCard key={post.id} post={post}/>
            ))}
        </div>
    </div>
  )
};

export default Home;