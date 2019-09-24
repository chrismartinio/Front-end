const setInterestsDataAction = (interestsData) => (dispatch)=> {
  dispatch({
    type: 'ADD_INTERESTS_DATA',
    PAYLOAD: interestsData
  })
}

export default setInterestsDataAction;
