const CreateProfileReducer = (
  state = {
    userData: null,
    profImage: null,
    profData: null,
    likes: [null],
    interestedData: null,
    weekendLocationData: null
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
      return { ...state, weekendLocationData: action.PAYLOAD };
    case "ADD_LIKES":
      return { ...state, likes: [...state.likes, action.PAYLOAD] };
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
