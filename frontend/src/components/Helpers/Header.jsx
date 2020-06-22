import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from 'actions/session';
import { initializeHeader } from 'assets/Helpers/js/headerFunctions';
import mainHeaderImg from 'assets/Helpers/images/White.svg';
import 'assets/Helpers/css/headerStyle.css';

const motto = "Get it done with";
const websiteTitle = "Template App";

function NormalHeader(pageTitle, isAuthenticated, logout) { //, isAdmin) {
    return(
        <div>
            <header>
                <div id="header-container">
                    <p id="motto">{motto}</p>
                    <Link to="/"><img id="header-img" src={mainHeaderImg} alt={`Website title: ${websiteTitle}`} /></Link>
                    <nav>
                        <div id="menu-full">
                            <Link className="menu-item" to="/">Home</Link>
                            {
                                (isAuthenticated)
                                ?
                                    <>
                                        <Link className="menu-item" to="/dashboard">Dashboard</Link>
                                        <Link className="menu-item" onClick={() => logout()}>Log Out</Link>
                                    </>
                                :
                                    <>
                                        <Link className="menu-item" to="/login">Log In</Link>
                                        <Link className="menu-item" to="/signup">Sign Up</Link>
                                    </>
                            }
                            <div className="menu-item sub-menu" style={{zIndex: 500}}>
                                <span>Demos</span>
                                <div className="inner-menu">
                                    <Link className="menu-item" to="/demos/media-modal">Media Modal</Link><br />
                                </div>
                            </div>

                            {/* {(isAdmin) ? <Link className="menu-item" to="/blogs/the-journal">The Journal</Link> : '' } */}
                            {/* <div className="menu-item sub-menu" style={{zIndex: 500}}>
                                <span>Downloads</span>
                                <div className="inner-menu">
                                    <Link className="menu-item" to="/downloads/alienbrowser">AlienBrowser</Link><br />
                                    <Link className="menu-item" to="/downloads/alientimer">AlienTimer</Link>
                                    <Link className="menu-item" to="/downloads/html-editor">HTML Editor</Link>
                                    <Link className="menu-item" to="/downloads/mobile-sync">Mobile Sync</Link>
                                    <Link className="menu-item" to="/downloads/jaa-productions-updater">J.A.A. Productions Updater</Link>
                                </div>
                            </div> */}
                        </div>
                        <div align="right" id="menu-button">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <span id="page-title">{pageTitle}</span>
                    </nav>
                </div>
                <p id="head-sep"></p>
            </header>
        </div>
    );
}

function AltHeader() {
    return(
        <div>
            <div id="header-container">
                <header>
                    <Link to="/"><img id="alt-header-img" src={mainHeaderImg} alt={`Website title: ${websiteTitle}`} /></Link>
                    <p id="alt-motto">{motto}</p>
                    <br />
                    <nav id="alt-nav">
                        <Link id="back-button" to="/">{'<-- Back Home'}</Link>
                    </nav>
                </header>
            </div>
            <p id="head-sep-alt"></p>
        </div>
    );
}

class Header extends React.Component {
    componentDidMount() {
        initializeHeader(this.props.isHeaderDisappearing);
    }

    getHeader(headerType, pageTitle, isAuthenticated) { //, userSession) {
        var header;
        //const isAdmin = userSession.isAuthenticated && userSession.isAdmin;
    
        if (headerType === 'Normal') {
            header = NormalHeader(pageTitle, isAuthenticated, this.props.logout)//, isAdmin);
        }
        else if (headerType === 'Alt') {
            header = AltHeader();
        }
    
        return header;
    }

    render() {
        return this.getHeader(this.props.headerType, this.props.pageTitle, this.props.loggedIn)//, this.props.session.user);
    }
}

Header.propTypes = {
    headerType: PropTypes.oneOf(['Normal', 'Alt']),
    pageTitle: PropTypes.string,
    isHeaderDisappearing: PropTypes.bool,
}

Header.defaultProps = {
    headerType: 'Normal',
    pageTitle: 'Page Title',
    isHeaderDisappearing: false,
}

const mapStateToProps = ({ session: { userId } }) => ({
    loggedIn: Boolean(userId)
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);