const SetProfilePersonalAction = (data) => (dispatch)=> {
  dispatch({
    type: 'ADD_PROFILE_DATA',
    PAYLOAD: data
  })
}

export default SetProfilePersonalAction;