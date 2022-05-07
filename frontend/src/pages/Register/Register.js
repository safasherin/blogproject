import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT
const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // console.log("Email validation ", re.test(email))
    return re.test(email);
}

const validatePassword = (password) => {
    // const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z].{8,16}$/;
    // console.log("Pass validation ", re.test(password))

    return re.test(password);
}



function Register() {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [email, setEmail] = useState("");
    const [state, setState] = useState("initial");
    const [errorsState, setErrorsState] = useState([]);
    // const [error, setError] = useState(false);

    let usernameField;
    let passwordField;
    let emailField;



    const formData = new FormData();


    const attachFile = async (e) => {


        // Create an array for the files attached
        // const files = Array.from(e.target.files);

        // // Append each file to the formData
        // await files.forEach(
        //     (file, index) => {
        //         formData.append("profilePic", file);
        //     }
        // )

        formData.append("profilePic", e.target.files[0])
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];


        if (!validateEmail(emailField.value) || !validatePassword(passwordField.value)) {
            errors.push("Please enter a valid email address and password");
        }
        // if (!validatePassword(passwordField.value)) {
        //     errors.push("Please enter a valid password");
        // }


        // 1.1 If there are errors, set the state to "validation error"
        if (errors.length > 0) {
            setState("validation error");
            // Populate the alert box with the errors
            setErrorsState(errors);
        }
        // 1.2 If there are no errors, set the state to "sending"
        else {
            setState("sending");
            setErrorsState([]);




            // setError(false);
            formData.append('username', usernameField.value);
            formData.append('email', emailField.value);
            formData.append('password', passwordField.value);
            // console.log(usernameField.value)
            // console.log(emailField.value)
            // console.log(passwordField.value)
            // console.log(formData)
            // for (var value of formData.entries()) {
            //     console.log(value[0] + "," + value[1])
            // }

            try {
                // console.log(formData)
                const res = await axios.post("/auth/register", formData)
                // const res = await axios.post("http://localhost:3002/auth/register", formData)

                setState("successful");
                res.data && window.location.replace("/login");
            } catch (error) {
                // setError(true);
                setState("unsuccessful");
                // console.log(error)
            }
        }
    }
    return (
        <div className="registerpage">
            <form onSubmit={handleSubmit}>
                <div className="registerField">
                    <h2 className="registertitle">Sign Up</h2>
                    <br />
                    <div className="imageDiv">
                        <label for="profilepic" className="form-label"
                            style={{ color: "white", fontSize: "20px", marginLeft: "50px" }}>Profile Pic : </label>
                        <input
                            onChange={attachFile}

                            type="file"
                            className="form-control imgfield" id="profilePic" aria-describedby="profilePic" />

                    </div>
                    <input type="text"
                        className="registerinputField"
                        placeholder="Username"
                        ref={(elem) => { usernameField = elem }}
                        required
                    // onChange={e => setUsername(e.target.value)}
                    />



                    <input type="email"
                        className="registerinputField"
                        placeholder="Email Address"
                        // required
                        ref={(elem) => { emailField = elem }}

                    // onChange={e => setEmail(e.target.value)}
                    />


                    <input type="password"
                        className="registerinputField"
                        placeholder="Password"
                        // required
                        // minLength="8"
                        ref={(elem) => { passwordField = elem }}

                    // onChange={e => setPassword(e.target.value)}
                    />

                    {
                        state !== "sending" && state !== "successful" &&

                        <button type="submit"
                            className="btn btn-primary registerinputbtn">
                            Sign Up
                        </button>
                    }
                    {
                        state === "validation error" &&
                        <div className="alert alertdiv" role="alert">
                            <ul>
                                {
                                    errorsState.map(
                                        (error) => <li>{error}</li>
                                    )
                                }
                            </ul>
                        </div>
                    }

                    {
                        state === "successful" &&
                        <div className="alert alert-success" role="alert">
                            You have registered successfully!
                        </div>
                    }

                    {
                        state === "unsuccessful" &&
                        <div className="alert alert-danger" role="alert">
                            Something went wrong!! Please try again later.
                        </div>
                    }
                    {
                        state === "sending" &&
                        <p style={{ color: "white" }}>Loading...</p>
                    }
                    <p className="paraSigninandup">Already our member? </p>
                    <Link to="/login">Sign In</Link>

                    {/* {error && <span style={{ color: "red" }}>Something went wrong!!</span>} */}

                </div>

            </form >
        </div>
    )

}

export default Register;
