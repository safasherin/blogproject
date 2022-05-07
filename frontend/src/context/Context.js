import { createContext, useEffect, useReducer } from 'react';
import Reducer from './Reducer.js';

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    jsonwebtoken: JSON.parse(localStorage.getItem("jsonwebtoken")) || null,
    isFetching: false,
    error: false
}


export const Context = createContext(INITIAL_STATE);


export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE)

    useEffect(() => {
        // console.log(state.user)
        // console.log("changing local storage.....")

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("jsonwebtoken", JSON.stringify(state.jsonwebtoken));
    }, [state.jsonwebtoken, state.user])



    return (
        <Context.Provider
            value={{
                user: state.user,
                jsonwebtoken: state.jsonwebtoken,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
            {children}
        </Context.Provider>
    );



}