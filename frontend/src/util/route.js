import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import Loading from 'components/Helpers/Loading.jsx';

const mapStateToProps = ({ session: { userId } }) => ({
    loggedIn: Boolean(userId)
});

const Lazy = ({path, component: Component, ...props}) => (
    <Route
        path={path}
        {...props} 
        render={props => 
            <Suspense fallback={<Loading />}>
                <Component {...props} />
            </Suspense>
        }
    />
);

const Auth = ({ loggedIn, path, component: Component, ...props }) => (
    <Route 
        path={path}
        {...props}
        render={props => (
            loggedIn 
                ?
                <Redirect to='/dashboard' /> 
                :
                <Suspense fallback={<Loading />}>
                    <Component {...props} />
                </Suspense> 
        )}
    />
);

const Protected = ({ loggedIn, path, component: Component, ...props }) => (
    <Route
        path={path}
        {...props}
        render={props => (
            loggedIn 
            ?
            <Suspense fallback={<Loading />}>
                <Component {...props} />
            </Suspense> 
            :
            <Redirect to='/login' />
        )}
    />
);

export const LazyRoute = withRouter(
    connect(mapStateToProps) (Lazy)
);

export const AuthRoute = withRouter(
    connect(mapStateToProps) (Auth)
);

export const ProtectedRoute = withRouter(
    connect(mapStateToProps) (Protected)
);