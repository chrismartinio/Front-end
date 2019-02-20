import { createStore, applyMiddleware } from 'redux';
import axios from 'axios'
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
// need to import root reducer
import rootReducer from './Reducers/CreateProfileReducer'

const middleware = applyMiddleware(thunk, createLogger())

export default function configureStore(){
  return createStore(rootReducer, middleware)
}
