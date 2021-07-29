import React, { useEffect, useState } from 'react';
import history from 'util/history';
//import ReactGA from 'react-ga';
import { LazyRoute, AuthRoute, ProtectedRoute, AdminProtectedRoute } from 'util/route';
import { Router, Switch, Redirect } from 'react-router-dom';

//TODO: CHANGE ID OR COMMENT OUT CODE BEFORE PRODUCTION
//ReactGA.initialize('UA-193138264-1');

//var firstLoad = true;

// if (firstLoad) {
//     ReactGA.set({ page: window.location.pathname }); // Update the user's current page
//     ReactGA.pageview(window.location.pathname); // Record a pageview for the given page
// }

// history.listen(location => {
//     firstLoad = false;
//     ReactGA.set({ page: location.pathname }); // Update the user's current page
//     ReactGA.pageview(location.pathname); // Record a pageview for the given page
// });

const Welcome = React.lazy(() => import('components/Welcome.jsx'));
const TicTacToe = React.lazy(() => import('components/TicTacToe.jsx'));
const LogIn = React.lazy(() => import('components/User/Login.jsx'));
const SignUp = React.lazy(() => import('components/User/SignUp.jsx'));
const Dashboard = React.lazy(() => import('components/User/Dashboard.jsx'));
const Page404 = React.lazy(() => import('components/Helpers/404.jsx'));

const App = ({ connected }) => {
  const [isConnected, setIsConnected] = useState(connected);

  useEffect(() => {
    if (isConnected !== connected) window.location.reload();
    setIsConnected(connected);
  }, [connected, isConnected]);

  return (
    <Router history={history}>
      <Switch>
        <LazyRoute exact path="/" component={Welcome} />
        <AuthRoute path="/login" component={LogIn} />
        <AuthRoute path="/signup" component={SignUp} />
        <AdminProtectedRoute path="/signup-new-user" exact component={SignUp} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <LazyRoute path="/game" component={TicTacToe} />
        <LazyRoute path="/404" component={Page404} />
        <Redirect to="/404" />
      </Switch>
    </Router>
  );
};

export default App;