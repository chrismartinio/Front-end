import { combineReducers } from "redux";
import CreateProfileDataReducer from "./CreateProfileDataReducer";
import CreateThirdPartyDataReducer from "./CreateThirdPartyDataReducer";
import uploadMediaReducer from "./uploadMediaReducer";
import ConfigReducer from "./ConfigReducer";
import GlobalReducer from "./GlobalReducer";

export default combineReducers({
  CreateProfileDataReducer,
  CreateThirdPartyDataReducer,
  uploadMediaReducer,
  ConfigReducer,
  GlobalReducer
});
