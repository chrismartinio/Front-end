const setIsThirdPartyServicesUserAction = (isThirdPartyServicesUserData) => (dispatch)=> {
  dispatch({
    type: 'SET_IS_THIRD_PARTY_SERVICES_USER',
    PAYLOAD: isThirdPartyServicesUserData
  })
}

export default setIsThirdPartyServicesUserAction;
