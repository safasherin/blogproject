import React, { useContext, useEffect, useState } from 'react';
import HeroImage from "../../components/HeroImage/HeroImage.js";
import Posts from "../../components/Posts/Posts.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import "./Home.css";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Context } from '../../context/Context.js';

function Home() {
    const [posts, setPosts] = useState([]);
    const { search } = useLocation();
    const { user } = useContext(Context);



    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get("/posts" + search);
            setPosts(res.data);

        };
        fetchPosts();
    }, [search]);
    return (
        <div>

            <HeroImage />
            <div className="home">
                {user &&
                    <Sidebar />
                }
                <Posts posts={posts} />


            </div>
        </div>
    );
}

export default Home;


