import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'util/history';
import { connect } from 'react-redux';
import { logout, subscribeToSessionValidation } from 'actions/session';
import { toggleEditMarqueeText, setMarqueeText } from 'actions/site_info';
import { initializeHeader, toggleMobileHeader } from 'assets/Helpers/js/headerFunctions';
// import { combinedQueryURL } from 'util/helpers';
import AdminSettingsFAB from 'components/Helpers/AdminSettingsFAB.jsx';
import Marquee from 'components/Helpers/Marquee.jsx';
import { ExitToApp as LogOutIcon, SupervisorAccount as ConsoleIcon } from '@material-ui/icons';
import mainHeaderImg from 'assets/Helpers/images/jaa2.png';
import 'assets/Helpers/css/headerStyle.css';

const motto = "Let's play some Tic Tac Toe! 😀";
const websiteTitle = "Online Tic-Tac-Toe";

const NormalHeader = props => {
    const menuItems = (
        <div>
            <span></span>
            <span></span>
        </div>
    );

    return(
        <div>
            <a href="https://jaaproductions.com" target="new_tab"><img id="header-img" src={mainHeaderImg} alt={`Website title: ${websiteTitle}`} /></a>
            <p id="motto">{motto}</p>
            <nav>
                {/* Full Menu */}
                <div id="menu-full">
                    {menuItems}
                </div>
                {/* **** */}

                {/* Mobile Menu */}
                <div id="menu-mobile" hidden={true}>
                    {menuItems.props.children.map(element => (Array.isArray(element.props.children) && !element.props.className) ? element.props.children.map(subElement => <p>{subElement}</p>) : <p>{element}</p>)}
                </div>
                <br />
                <span id="page-title">{props.pageTitle}</span>
                <br />
                {/* <div id="menu-button">
                    <div></div>
                    <div></div>
                    <div></div>
                </div> */}
                {/* <MenuIcon id="menu-button" onClick={() => props.setIsMobileMenuOpen(toggleMobileHeader())} /> */}
                {/* **** */}
            </nav>
        </div>
    );
}

const AltHeader = () => {
    return(
        <div>
            <a href="https://jaaproductions.com" target="new_tab"><img id="header-img" src={mainHeaderImg} alt={`Website title: ${websiteTitle}`} /></a>
            {/*<p id="alt-motto">{motto}</p>*/}
            <br /><br />
            {/* <nav id="alt-nav">
                <Link id="back-button" to="/">{'<-- Back Home'}</Link>
            </nav> */}
        </div>
    );
}

const Header = props => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { subscribeToSessionValidation } = props;

    useEffect(() => {
        subscribeToSessionValidation();
    }, [subscribeToSessionValidation]);

    useEffect(() => {
        initializeHeader(props.isHeaderDisappearing);
    }, [props.isHeaderDisappearing]);

    const getHeader = (headerType, pageTitle, isAuthenticated, isAdmin, isPseudoAdmin) => { //, userSession) {
        var header;
        var sep;
        //const isAdmin = userSession.isAuthenticated && userSession.isAdmin;
    
        if (headerType === 'Normal') {
            // header = NormalHeader(pageTitle, isAuthenticated, props.logout)//, isAdmin);
            header = <NormalHeader
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                        pageTitle={pageTitle}
                        isAuthenticated={isAuthenticated}
                        isAdmin={(isAdmin || isPseudoAdmin) && window.location.pathname === '/dashboard'}
                        logout={props.logout}
                    />;
            sep = <p id="head-sep"></p>;
        }
        else if (headerType === 'Alt') {
            header = AltHeader();
            sep = <p id="head-sep-alt"></p>;
        }

        const permanentAdminFABActions = [];

        if (window.location.pathname !== '/dashboard') {
            permanentAdminFABActions.push({ name: 'Go to Dashboard', icon: <ConsoleIcon />, onClick: () => history.push('/dashboard') });
        }
        
        permanentAdminFABActions.push({ name: 'Log Out', icon: <LogOutIcon />, onClick: () => props.logout() });
    
        return (
            <header>
                <div id="header-container">
                    {
                        ((isAdmin || isPseudoAdmin))
                        ?
                            <Marquee
                                marqueeText={(props.canEditMarqueeText) ? props.temp_marquee_text : props.marquee_text}
                                setMarqueeText={props.setMarqueeText}
                                updateMarqueeText={() => { alert('Updated!...well this is just a demo, so you can\'t actually change the text 😁, but this would update on your actual website 😃 (Note: Only a user with Admin access would be able to do this on the actual website.)'); window.location.reload(); }}
                                isAdmin={(isAdmin || isPseudoAdmin) && window.location.pathname === '/dashboard'}
                                isEditMode={props.canEditMarqueeText}
                                toggleEditMode={props.toggleEditMarqueeText}
                            />
                        :
                            <Marquee
                                marqueeText={(props.canEditMarqueeText) ? props.temp_marquee_text : props.marquee_text}
                                updateMarqueeText={() => { alert('Updated!...well this is just a demo, so you can\'t actually change the text 😁, but this would update on your actual website 😃 (Note: Only a user with Admin access would be able to do this on the actual website.)'); window.location.reload(); }}
                                isAdmin={props.loggedIn}
                            />
                    }
                    <br />
                    {header}
                </div>
                {sep}
                <div id="menu-transparent-film" hidden={true} onClick={() => setIsMobileMenuOpen(toggleMobileHeader())}></div>
                <AdminSettingsFAB
                    actions={
                        [
                            ...props.adminSettingsFABActionData.actions,
                            ...permanentAdminFABActions
                        ]
                    }
                    keepOpen={props.adminSettingsFABActionData.keepOpen}
                />
            </header>
        );
    }

    return getHeader(props.headerType, props.pageTitle, props.loggedIn, props.isAdmin, props.isPseudoAdmin);//, props.session.user);
}

Header.propTypes = {
    headerType: PropTypes.oneOf(['Normal', 'Alt']),
    pageTitle: PropTypes.string,
    isHeaderDisappearing: PropTypes.bool,
    adminSettingsFABActionData: PropTypes.shape({ actions: PropTypes.array, keepOpen: PropTypes.bool }),
}

Header.defaultProps = {
    headerType: 'Normal',
    pageTitle: 'Page Title',
    isHeaderDisappearing: false,
    adminSettingsFABActionData: { actions: [], keepOpen: false },
}

const mapStateToProps = ({ session: { userId, isAdmin, isPseudoAdmin }, site_info: { marquee_text, temp_marquee_text, canEditMarqueeText } }) => ({
    loggedIn: Boolean(userId),
    isAdmin: Boolean(userId) && Boolean(isAdmin),
    isPseudoAdmin: Boolean(userId) && Boolean(isPseudoAdmin),
    marquee_text,
    temp_marquee_text,
    canEditMarqueeText
});

const mapDispatchToProps = dispatch => ({
    subscribeToSessionValidation: () => dispatch(subscribeToSessionValidation()),
    logout: () => dispatch(logout()),
    setMarqueeText: marqueeText => dispatch(setMarqueeText(marqueeText)),
    toggleEditMarqueeText: () => dispatch (toggleEditMarqueeText())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);