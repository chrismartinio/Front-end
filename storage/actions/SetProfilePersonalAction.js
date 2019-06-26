const SetProfilePersonalAction = (profData) => (dispatch)=> {
  dispatch({
    type: 'ADD_PROFILE_DATA',
    PAYLOAD: profData
  })
}

export default SetProfilePersonalAction;
