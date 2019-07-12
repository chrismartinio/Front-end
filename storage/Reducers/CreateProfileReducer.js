const CreateProfileReducer = (
  state = {
    userData: null,
    profImage: null,
    profData: null,
    likes: [null],
    interestedData: null,
    weekendLocation: [null]
  },
  action
) => {
  switch (action.type) {
    case "ADD_PROFILE_PICTURE":
      return { ...state, profImage: action.PAYLOAD };
    case "ADD_PROFILE_DATA":
      return { ...state, profData: action.PAYLOAD };
    case "ADD_USER_DATA":
      return { ...state, userData: action.PAYLOAD };
    case "ADD_INTERESTED_DATA":
      return { ...state, interestedData: action.PAYLOAD };
    case "ADD_WOULDRATHER_DATA":
      return { ...state, wouldRatherData: action.PAYLOAD };
    case "ADD_WEEKEND_LOCATION_DATA":
      return { ...state, weekendLocation: [action.PAYLOAD] };
    case "REMOVE_WEEKEND_LOCATION_DATA":
      return { ...state, weekendLocation: [] };
    case "ADD_LIKES":
      return { ...state, likes: [...state.likes, action.PAYLOAD] };
    case "REMOVE_LIKES":
      let index = state.likes.indexOf(action.PAYLOAD);
      return {
        ...state,
        likes: [...state.likes.slice(0, index), ...state.likes.slice(index + 1)]
      };
    case "SET_FIRST_LIKE":
      return {
        ...state,
        likes: [action.PAYLOAD]
      };
    default:
      return state;
  }
};

export default CreateProfileReducer;
