import React from 'react';
import history from 'util/history';
import { LazyRoute, AuthRoute, ProtectedRoute } from 'util/route';
import { Router } from 'react-router-dom';

const Welcome = React.lazy(() => import('components/Welcome.jsx'));
const TicTacToe = React.lazy(() => import('components/TicTacToe.jsx'));
const LogIn = React.lazy(() => import('components/User/Login.jsx'));
const SignUp = React.lazy(() => import('components/User/SignUp.jsx'));
const Dashboard = React.lazy(() => import('components/User/Dashboard.jsx'));

export default () => (
  <Router history={history}>
    <LazyRoute exact path="/" component={Welcome} />
    <LazyRoute path="/game" component={TicTacToe} />
    <AuthRoute path="/login" component={LogIn} />
    <AuthRoute path="/signup" component={SignUp} />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
  </Router>
);
