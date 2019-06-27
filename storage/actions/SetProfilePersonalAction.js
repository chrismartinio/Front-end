const setProfilePersonalAction = (profData) => (dispatch)=> {
  dispatch({
    type: 'ADD_PROFILE_DATA',
    PAYLOAD: profData
  })
}

export default setProfilePersonalAction;
