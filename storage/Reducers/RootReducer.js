import { combineReducers } from 'redux';
import CreateProfileReducer from './CreateProfileReducer';
import CreateProfileDataReducer from './CreateProfileDataReducer';
import CreateThirdPartyDataReducer from './CreateThirdPartyDataReducer'

export default combineReducers({
  CreateProfileDataReducer,
  CreateThirdPartyDataReducer
})
