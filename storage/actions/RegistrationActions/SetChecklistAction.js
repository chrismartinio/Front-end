const setChecklistAction = (checklist) => (dispatch)=> {
  dispatch({
    type: 'SET_CHECKLIST',
    PAYLOAD: checklist
  })
}

export default setChecklistAction;
