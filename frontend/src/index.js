import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App.jsx';
import configureStore from 'store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { checkLoggedIn } from 'util/sessions';

const renderApp = preloadedState => {
  const store = configureStore(preloadedState)

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );


  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  //serviceWorker.unregister();

  //FOR TESTING, remove before production
  //window.getState = store.getState;
};

(async () => renderApp(await checkLoggedIn()))();