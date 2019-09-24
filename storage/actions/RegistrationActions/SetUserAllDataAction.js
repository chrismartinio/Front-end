const setUserAllDataAction = (userAllData) => (dispatch)=> {
  dispatch({
    type: 'SET_USER_ALL_DATA',
    PAYLOAD: userAllData
  })
}

export default setUserAllDataAction;
