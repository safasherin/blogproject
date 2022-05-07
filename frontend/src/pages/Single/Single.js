import React from 'react';

import SinglePost from '../../components/SinglePost/SinglePost.js';
import Sidebar from '../../components/Sidebar/Sidebar.js';
import './Single.css';

function Single() {
    return (
        <div className="single">
            <SinglePost />
            <Sidebar className="singlesidebar" />

        </div>

    )
}

export default Single;