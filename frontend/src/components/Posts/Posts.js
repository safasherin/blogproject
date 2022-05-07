import React from 'react';

import './Posts.css';
import Post from '../Post/post.js';
function Posts({ posts }) {
    return (
        <div className="posts">
            {posts.map((p) => (
                <Post key={p.id} post={p} />
            ))
            }
        </div>
    )
}
export default Posts;