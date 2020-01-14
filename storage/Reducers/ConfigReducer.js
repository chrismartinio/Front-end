let initialState = {
  minuteChatTimer_time: 90
};

const ConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TIME":
      return {
        ...state,
        minuteChatTimer_time: action.PAYLOAD.time
      };
    default:
      return state;
  }
};

export default ConfigReducer;
