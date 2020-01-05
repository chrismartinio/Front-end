const CreateJWTDataReducer = (state = { JWT: null, facebook: [] }, action) => {
  switch (action.type) {
    case "ADD_FACEBOOK_DATA":
      return {
        ...state,
        facebook: action.PAYLOAD
      };
    case "ADD_JWT":
      return {
        ...state,
        JWT: action.PAYLOAD
      };

    default:
      return state;
  }
};

export default CreateJWTDataReducer;
