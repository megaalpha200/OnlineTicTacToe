import React from 'react';
import history from 'util/history';
import { LazyRoute, AuthRoute, ProtectedRoute } from 'util/route';
import { Router } from 'react-router-dom';

const Welcome = React.lazy(() => import('components/Welcome.jsx'));
const LogIn = React.lazy(() => import('components/User/Login.jsx'));
const SignUp = React.lazy(() => import('components/User/SignUp.jsx'));
const Dashboard = React.lazy(() => import('components/User/Dashboard.jsx'));
const MediaModalDemo = React.lazy(() => import('components/Demos/MediaModalDemo.jsx'));

export default () => (
  <Router history={history}>
    <LazyRoute exact path="/" component={Welcome} />
    <AuthRoute path="/login" component={LogIn} />
    <AuthRoute path="/signup" component={SignUp} />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
    <LazyRoute exact path="/demos/media-modal" component={MediaModalDemo} />
  </Router>
);
