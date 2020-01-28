let initialState = {
  onlineUserList: []
};

const GlobalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ONLINE_USER_LIST":
      return {
        ...state,
        onlineUserList: action.PAYLOAD.onlineUserList
      };
    default:
      return state;
  }
};

export default GlobalReducer;
