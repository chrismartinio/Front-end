const setInterestedDataAction = (interestedData) => (dispatch)=> {
  dispatch({
    type: 'ADD_INTERESTED_DATA',
    PAYLOAD: interestedData
  })
}

export default setInterestedDataAction;
