const CreateThirdPartyDataReducer = ( state = {facebook:[]}, action) => {
  switch(action.type){
    case "ADD_FACEBOOK_DATA":
      return {
        ...state,
        facebook: action.PAYLOAD
      };

    default:
      return state
    }

}

export default CreateThirdPartyDataReducer;