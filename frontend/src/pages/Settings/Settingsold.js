
import "./Settings.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { BiUser } from "react-icons/bi";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT


function Settings() {
    const { user, jsonwebtoken, dispatch } = useContext(Context);
    const [username, setUsername] = useState("");
    // const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState(false);
    const updatedUser = new FormData()

    useEffect(() => {
        const updateUser = async () => {
            try {
                await axios.get('/users/' + user._id);
                // setEmail(user.email);
                setPassword(user.password);
                setUsername(user.username);
                if (user.profilePic) {
                    setProfilePic(user.profilePic);

                }

            } catch (err) { }
        }
        updateUser();

    }, [user]);


    // let usernameField;
    // let passwordField;
    // let emailField;
    // const formData = new FormData();
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     formData.append('username', usernameField.value);
    //     formData.append('email', emailField.value);
    //     formData.append('password', passwordField.value);
    //     formData.append('profilePic', file);
    //     formData.append('userId', user._id);

    //     try {
    //         await axios.put('/users/' + user._id, formData,
    //             {
    //                 headers: { Authorization: `Bearer ${jsonwebtoken}` }
    //             }
    //         );
    //         setSuccess(true)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }
    const attachFile = async (e) => {


        // Create an array for the files attached
        // const files = Array.from(e.target.files);

        // // Append each file to the formData
        // await files.forEach(
        //     (file, index) => {
        //         formData.append("profilePic", file);
        //     }
        // )

        updatedUser.append("profilePic", e.target.files[0])
        setFile(e.target.files[0])
    }
    const handleSubmit = async (e) => {


        e.preventDefault();
        dispatch({ type: "UPDATE_START" });
        updatedUser.append("userId", user._id)
        updatedUser.append("username", username)


        // console.log(updatedUser)
        // console.log(jsonwebtoken)
        // console.log(user._id)
        // console.log("here")
        // console.log(updatedUser)
        try {
            console.log(updatedUser)
            const returnedUser = await axios.put('/users/' + user._id, updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${jsonwebtoken}`
                    }
                });
            const updatedUserData = returnedUser.updatedUser;
            // console.log(updatedUserData)
            setSuccess(true)
            dispatch({ type: "UPDATE_SUCCESS", payload: { updatedUserData, jsonwebtoken } });


        } catch (err) {
            dispatch({ type: "UPDATE_FAILURE" });
            console.log(err)
        }
    }





    return (
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingsUpdateTitle">Update Your Account</span>
                    <button className="settingsDeleteTitle" >Delete Account</button>
                </div>
                {/* onClick={deleteUser} */}
                <label className="profTitle">Profile Picture</label>
                <div className="settingsPP">
                    {profilePic ? <img src={profilePic} /> : null}
                    {file ? <img src={URL.createObjectURL(file)} /> : null}
                    {/* <img
                        src={file ? URL.createObjectURL(file) : user.profilePic}

                    /> */}
                    <label htmlFor="fileInput" className="settingsImageAdd">
                        <BiUser />
                    </label>
                    <input type="file" id="fileInput"
                        onChange={attachFile}
                        style={{ display: "none" }} />

                </div>
                <form className="settingsForm" onSubmit={handleSubmit} >
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    // ref={(elem) => { usernameField = elem }}
                    />
                    {/* <label>Email</label>
                    <input
                        type="email"
                        value={email}

                        // ref={(elem) => { emailField = elem }}
                        onChange={e => setEmail(e.target.value)}
                    /> */}
                    {/* <label>Password</label>
                    <input
                        type="password"
                        value=password

                        // ref={(elem) => { passwordField = elem }}
                        onChange={e => setPassword(e.target.value)}
                    /> */}
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