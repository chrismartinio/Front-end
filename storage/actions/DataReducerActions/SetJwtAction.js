const setJwtAction = (JWTdata) => (dispatch) => {
    dispatch({
        type:"ADD_FACEBOOK_DATA",
        PAYLOAD: JWTdata
    })
}

export default setJwtAction;