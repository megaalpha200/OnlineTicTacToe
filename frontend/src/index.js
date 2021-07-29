import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App.jsx';
import configureStore from 'store/store';
import { Provider } from 'react-redux';
import { checkLoggedIn } from 'util/api/sessions';
import { getInfo as getSiteInfo } from 'util/api/site_info';
import { checkGameData } from 'util/api/game';
import { callAPIAsync } from 'util/helpers';

const renderApp = (preloadedState, connected = true) => {
  const store = configureStore(preloadedState)

  ReactDOM.render(
    <Provider store={store}>
      <React.StrictMode>
        <App connected={connected} />
      </React.StrictMode>
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

const retrieveData = async () => {
  const retrieveAndRender = async () => {
    var login_info_res = {};
    var site_info_res = {};
    var game_data_res = {};
    var isConnectionActive = true;
  
    try {
      login_info_res = await checkLoggedIn() ?? {};
      site_info_res = (await callAPIAsync(getSiteInfo(), '', false)).result;
      game_data_res = await checkGameData();
    }
    catch(e) {
      isConnectionActive = false;
      site_info_res = { marquee_text: 'Please Check Your Network Connection!' };
    }
    finally {
      site_info_res.canEditMarqueeText = false;
      site_info_res.temp_marquee_text = site_info_res.marquee_text;
  
      renderApp({ ...login_info_res, site_info: site_info_res, ...game_data_res }, isConnectionActive);
    }

    return isConnectionActive;
  }

  if (!(await retrieveAndRender())) {
    var checkIfConnectionIsActive = setInterval(async () => {
      if (await retrieveAndRender()) clearInterval(checkIfConnectionIsActive);
    }, 2000);
  }
}

retrieveData();