import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Loading from 'components/Helpers/Loading.jsx';

const mapStateToProps = ({ session: { userId, isAdmin } }) => ({
    loggedIn: Boolean(userId),
    isAdmin: Boolean(userId) && Boolean(isAdmin)
});

const checkForQuery = () => {
    const query = queryString.parse(window.location.search);

    if (query.original_url && query.original_url !== '/') {
        return (Array.isArray(query.original_url) ? query.original_url[query.original_url.length-1] : query.original_url);
    }

    return '/dashboard';
}

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
                <Redirect to={checkForQuery()} /> 
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

const AdminProtected = ({ isAdmin, path, component: Component, ...props }) => (
    <Route
        path={path}
        {...props}
        render={props => (
            isAdmin 
            ?
            <Suspense fallback={<Loading />}>
                <Component {...props} />
            </Suspense> 
            :
            <Redirect to='/404' />
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

export const AdminProtectedRoute = withRouter(
    connect(mapStateToProps) (AdminProtected)
);