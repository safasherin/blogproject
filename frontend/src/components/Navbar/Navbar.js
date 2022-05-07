import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import { FaUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import './Navbar.css';
function Navbar() {
    const { user, dispatch } = useContext(Context);

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" })
    }
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(true);
    const renderMobileList = () => {
        setOpen(true);
        setView(!view);

    }
    const renderDesktopList = () => {
        setOpen(false);
        setView(!view);

    }
    return (
        <div className="">
            <nav>
                <div className="desktopView">
                    <div className="logo">
                        <div className="link"><Link to="/" >iDea</Link></div>
                    </div>

                    <div className="divide">
                        <ul className="navLinks">
                            <li ><Link to="/" >Home</Link></li>

                            <li ><Link to="/texteditor" >Write</Link></li>

                        </ul>
                    </div>

                    <div className="divide2">
                        {user ? (
                            <Link to="/settings">
                                {user.profilePic ?
                                    <div className="prof">
                                        <div className="link" onClick={handleLogout}>Logout</div>
                                        <img className="profileimg" src={user.profilePic} alt="img" />
                                    </div>
                                    :
                                    <div className="prof">
                                        <div className="link" onClick={handleLogout}>Logout</div>

                                        <FaUserCircle className="profileimg" />
                                    </div>
                                }
                            </Link>
                        ) : (

                            <div className="rightlinks">
                                <div ><Link to="/login" >Login</Link> </div >
                                <div ><Link to="/register" >Register</Link></div>
                            </div >

                        )
                        }
                    </div>
                </div>
            </nav >


            <div className="mobileView">
                {view ?
                    <div className="">
                        <div className="logo">
                            <div className="link"><Link to="/" >iDea</Link></div>
                        </div>
                        <div className="hamburger-toggle">
                            <i className="fas fa-bars fa-lg"
                                onClick={renderMobileList}
                            ></i>

                        </div>
                    </div>
                    :
                    <IoClose className="closeIcon"
                        onClick={renderDesktopList}
                    />
                }
                {
                    open &&

                    <div className="mobileV">

                        <div className="divide">
                            <ul className="navLinks">
                                <li ><Link to="/" >Home</Link></li>

                                <li ><Link to="/texteditor" >Write</Link></li>

                            </ul>
                        </div >
                        <div className="divide2">
                            {user ? (
                                <Link to="/settings">


                                    <div className="prof">
                                        <div className="linkm" onClick={handleLogout}>Logout</div>
                                        <div className="linkm">Settings</div>
                                    </div>

                                </Link>
                            ) : (
                                <ul className="rightlinks">
                                    <li ><Link to="/login" >Login</Link> </li >
                                    <li ><Link to="/register" >Register</Link></li>
                                </ul >

                            )
                            }
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}

export default Navbar;