const setJwtAction = (JWTdata) => (dispatch) => {
    dispatch({
        type:"ADD_JWT",
        PAYLOAD: JWTdata
    })
}

export default setJwtAction;