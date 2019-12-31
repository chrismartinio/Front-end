import { createStore, applyMiddleware } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
// need to import root reducer
import rootReducer from "./Reducers/RootReducer";

//const middleware = applyMiddleware(thunk, promise ,createLogger())
const middleware = applyMiddleware(thunk, promise);

export default function configureStore() {
  return createStore(rootReducer, middleware);
}
