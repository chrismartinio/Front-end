const setLocalDestinationDataAction = (localDestinationData) => (dispatch)=> {
  dispatch({
    type: 'ADD_LOCALDESTINATION_DATA',
    PAYLOAD: localDestinationData
  })
}

export default setLocalDestinationDataAction;
