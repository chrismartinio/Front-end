const CreateProfileReducer = (
  state = {
    mode: null,
    userData: null,
    profImage: null,
    profData: null,
    likesData: null,
    interestedData: null,
    weekendLocation: null,
    wouldRatherData: null
  },
  action
) => {
  switch (action.type) {
    case "INSERT_DUMMY_DATA":
      return {
        ...state,
        mode: action.PAYLOAD.mode,
        userData: action.PAYLOAD.userData,
        profImage: null,
        profData: action.PAYLOAD.profData,
        interestedData: action.PAYLOAD.interestedData,
        likesData: action.PAYLOAD.likesData,
        wouldRatherData: action.PAYLOAD.wouldRatherData,
        weekendLocation: action.PAYLOAD.weekendLocation
      };
    case "RESET_REDUX_DATA":
      return {
        ...state,
        mode: null,
        userData: null,
        profImage: null,
        profData: null,
        likesData: null,
        interestedData: null,
        weekendLocation: null,
        wouldRatherData: null
      };
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
      return { ...state, weekendLocation: action.PAYLOAD };
    //case "ADD_WEEKEND_LOCATION_DATA":
    //  return { ...state, weekendLocation: [action.PAYLOAD] };
    //case "REMOVE_WEEKEND_LOCATION_DATA":
    //  return { ...state, weekendLocation: [] };
    case "ADD_LIKES":
      return { ...state, likesData: action.PAYLOAD };
    //case "ADD_LIKES":
    //  return { ...state, likes: [...state.likes, action.PAYLOAD] };
    //case "REMOVE_LIKES":
    //  let index = state.likes.indexOf(action.PAYLOAD);
    //  return {
    //    ...state,
    //    likes: [...state.likes.slice(0, index), ...state.likes.slice(index + 1)]
    //  };
    //case "SET_FIRST_LIKE":
    //  return {
    //    ...state,
    //    likes: [action.PAYLOAD]
    //  };
    default:
      return state;
  }
};

export default CreateProfileReducer;
