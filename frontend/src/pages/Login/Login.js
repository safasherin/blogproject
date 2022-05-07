import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';

import { Link } from 'react-router-dom';
import { Context } from '../../context/Context.js';
import './Login.css';



// RegEx (Regular Expressions)


const validatePassword = (password) => {
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z].{8,16}$/;
    return re.test(password);
}




function Login() {


    // "initial", "sending", "successful", "unsuccessful"
    const [state, setState] = useState("initial");
    const userRef = useRef();
    const passwordRef = useRef();
    const { dispatch, isFetching } = useContext(Context);



    const handleSubmit = async (e) => {
        e.preventDefault();
        // dispatch({ type: "LOGIN_START" })

        const errors = [];
        if (!validatePassword(passwordRef.current.value)) {
            errors.push("Please enter a valid username and password");
            //     // console.log("passwordRef", passwordRef.current.value)
            // }
            // 1.1 If there are errors, set the state to "validation error"
            if (errors.length > 0) {
                setState("validation error");
                //     // console.log(errors)
            }
            // // 1.2 If there are no errors, set the state to "sending"
            // console.log("1");
        }
        else {
            // console.log("2");
            dispatch({ type: "LOGIN_START" })
            setState("sending");

            try {

                const res = await axios.post("/auth/login", {

                    username: userRef.current.value,
                    password: passwordRef.current.value,

                });

                // console.log("passwordRef:", passwordRef.current.value)
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
                setState("successful");
            } catch (err) {
                dispatch({ type: "LOGIN_FAILURE" });

                setState("Unsuccessful");

            };


        }
    }
    return (

        <div className="signInpage">

            <form action="" method="post" onSubmit={handleSubmit}>
                <div className="signInField">
                    <h2 className="signIntitle">Sign In</h2>
                    <input
                        type="text"
                        className="signIninputField"
                        placeholder="Username"
                        // required
                        ref={userRef}
                    />
                    <input type="password"
                        className="signIninputField"
                        placeholder="Password"
                        // required
                        // minLength="8"
                        ref={passwordRef} />
                    <a className="signInAnchor" href="www.google.com">Forgot Password?</a>

                    {
                        state !== "sending" && state !== "successful" && state !== "validation error" && state !== "unsuccessful" &&
                        <button type="submit"
                            className="btn signInbtn" disabled={isFetching}>

                            Sign In</button>
                    }
                    {
                        state === "validation error" &&
                        <div className="alert alert-danger" role="alert">
                            Incorrect email or password.
                        </div>
                    }

                    {
                        state === "successful" &&
                        <div className="alert alert-success" role="alert">
                            You have signed in successfully!
                        </div>
                    }

                    {
                        state === "unsuccessful" &&
                        <div className="alert alert-danger" role="alert">
                            Something went wrong!!! Please try again later.
                        </div>
                    }

                    {
                        state === "sending" &&
                        <p>Loading...</p>
                    }
                    <p className="paraSigninandup">Not a member? </p>
                    <Link to="/register">Sign Up</Link>
                </div>
            </form >
        </div >

    )


}
export default Login;