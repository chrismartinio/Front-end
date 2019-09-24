const setCreateAccountDataAction = (createAccountData) => (dispatch)=> {
  dispatch({
    type: 'ADD_CREATEACCOUNT_DATA',
    PAYLOAD: createAccountData
  })
}

export default setCreateAccountDataAction;
