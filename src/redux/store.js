import { createStore, applyMiddleware, compose } from "redux";
import {thunk} from "redux-thunk";
import reducers from "./reducers";

const middlewares = [thunk];

export function configureStore(initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  return store;
}
