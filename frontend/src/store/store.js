import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from 'reducers/root';

 const store = preloadedState => (
    createStore(
        reducer,
        preloadedState,
        compose(
            applyMiddleware(thunk)//, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    )
);

export default store;