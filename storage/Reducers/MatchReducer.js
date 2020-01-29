let initialState = {
  matchlist: []
};

const MatchReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NEW_MATCH_LIST":
      return {
        ...state,
        matchlist: action.PAYLOAD.matchlist
      };
    default:
      return state;
  }
};

export default MatchReducer;
