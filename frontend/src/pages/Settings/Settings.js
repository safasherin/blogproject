import "./Settings.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;


function Settings() {


    const [file, setFile] = useState(null);
    const [username, setUsername] = useState("");
    const [success, setSuccess] = useState(false);
    const { user, jsonwebtoken, dispatch } = useContext(Context);

    useEffect(() => {
        const updateUser = async () => {


            setUsername(user.username);
        }
        updateUser()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "UPDATE_START" });
        const updatedUser = new FormData();
        updatedUser.append("userId", user._id)
        updatedUser.append("username", username)


        if (file) {

            updatedUser.append("profilePic", file)



        }
        try {
            const returnedUser = await axios.put('/users/' + user._id, updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${jsonwebtoken}`
                    }
                })

            setSuccess(true)



            dispatch({ type: "UPDATE_SUCCESS", payload: returnedUser });

        } catch (err) {
            dispatch({ type: "UPDATE_FAILURE" });

        }
    }

    // 
    return (
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingsUpdateTitle">Update Your Account</span>
                </div>

                <form className="settingsForm" onSubmit={handleSubmit} >
                    <label className="profTitle">Profile Picture</label>
                    <div className="settingsPP">

                        <label htmlFor="fileInput" >
                            <img src={file ? URL.createObjectURL(file) : user.profilePic}
                                alt="" className="settingsImageAdd" />
                        </label>
                        <input type="file" id="fileInput"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: "none" }} />

                    </div>

                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}

                    />

                    <button className="settingsSubmit" type="submit">
                        Update
                    </button>
                    {success && <span style={{ color: "green", fontSize: "20px", textAlign: "center", marginTop: "10px" }}>Succesfully Updated Your Profile!!</span>}

                </form>
            </div>
            <Sidebar />
        </div>
    );
}


export default Settings;