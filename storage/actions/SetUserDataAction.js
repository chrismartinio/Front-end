const setUserDataAction = (userData) => (dispatch)=> {
  dispatch({
    type: 'ADD_USER_DATA',
    PAYLOAD: userData
  })
}

export default setUserDataAction;
