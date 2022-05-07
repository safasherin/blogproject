import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../context/Context.js';
import './Sidebar.css';
import { FaUserCircle } from "react-icons/fa";

import axios from 'axios';
function Sidebar() {
    const [cats, setCats] = useState([]);

    useEffect(() => {
        const getCats = async () => {
            const res = await axios.get("/category");
            setCats(res.data);
        };
        getCats();
    }, [])
    const { user } = useContext(Context);
    return (

        <div className="sidebar">

            <div className="sidebarItem">

                <span className="sidebarTitle">ABOUT ME</span>
                {user.profilePic ?
                    <img src={user.profilePic} alt="img" />
                    :
                    <div >

                        <FaUserCircle className="profImage" />
                    </div>
                }
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsum nostrum, quasi libero ab adipisci vitae commodi nesciunt ratione!
                </p>
            </div>
            {
                cats.length > 0 &&
                <div className="sidebarItem">


                    <span className="sidebarTitle">TOPICS I FOLLOW</span>
                    <ul className="sidebarList">
                        {cats.map((c) => {
                            <li className="sidebarListItem">{c.name}</li>
                        })}

                    </ul>

                </div>
            }
        </div>

    )

}
export default Sidebar;

