const setPreferencesDataAction = (preferencesData) => (dispatch)=> {
  dispatch({
    type: 'ADD_PREFERENCES_DATA',
    PAYLOAD: preferencesData
  })
}

export default setPreferencesDataAction;
