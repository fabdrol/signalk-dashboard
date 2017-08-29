import { createStore } from 'redux';
import reducers from '../reducers';

function reduxStore(initialState) {
  const store = createStore(reducers, initialState, window.devToolsExtension && window.devToolsExtension())

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')  // eslint-disable-line global-require
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

export default reduxStore
