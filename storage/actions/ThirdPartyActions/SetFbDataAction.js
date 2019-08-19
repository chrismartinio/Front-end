const setFbDataAction = (fbData) => (dispatch) => {
    dispatch({
        type:"ADD_FACEBOOK_DATA",
        PAYLOAD: fbData
    })
}

export default setFbDataAction;