const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                jsonwebtoken: null,
                isFetching: true,
                error: false
            }

        case "LOGIN_SUCCESS":
            return {
                user: action.payload.user,
                jsonwebtoken: action.payload.jsonwebtoken,
                isFetching: false,
                error: false
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                jsonwebtoken: null,
                isFetching: false,
                error: true
            };

        case "UPDATE_START":
            return {
                ...state,
                isFetching: true,


            }

        case "UPDATE_SUCCESS":
            // console.log(action.payload.data)
            return {
                user: action.payload.data,
                jsonwebtoken: state.jsonwebtoken,
                isFetching: false,
                error: false
            }
        case "UPDATE_FAILURE":
            return {
                user: state.user,
                jsonwebtoken: state.jsonwebtoken,
                isFetching: false,
                error: true
            };
        case "LOGOUT":
            return {
                user: null,
                jsonwebtoken: null,
                isFetching: false,
                error: false
            };
        default: return state;
    }

}

export default reducer;