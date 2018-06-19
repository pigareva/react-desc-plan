import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import { INITIAL_STATE, START_WORKING_DAY_TIME } from './consts';

const vanillaPromise = store => next => (action) => {
  if (typeof action.then !== 'function') {
    return next(action);
  }

  return Promise.resolve(action).then(store.dispatch);
};

const store = createStore(rootReducer, INITIAL_STATE, compose(
  applyMiddleware(vanillaPromise),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
));

export default store;
