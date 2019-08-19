import { combineReducers } from 'redux';
import CreateProfileReducer from './CreateProfileReducer';
import CreateThirdPartyDataReducer from './CreateThirdPartyDataReducer'

export default combineReducers({
  CreateProfileReducer,
  CreateThirdPartyDataReducer
})


