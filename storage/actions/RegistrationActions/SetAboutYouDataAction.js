const setAboutYouDataAction = (aboutYouData) => (dispatch)=> {
  dispatch({
    type: 'ADD_ABOUTYOU_DATA',
    PAYLOAD: aboutYouData
  })
}

export default setAboutYouDataAction;
