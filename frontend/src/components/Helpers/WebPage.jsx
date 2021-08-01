import React from 'react';
import PropTypes from 'prop-types';
// import { Fab } from '@material-ui/core';
// import UpIcon from '@material-ui/icons/KeyboardArrowUp';
// import { scroll } from 'assets/Helpers/js/ScrollToTop';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'assets/Helpers/css/mainStyle.css';
import Header from 'components/Helpers/Header.jsx';
import Footer from 'components/Helpers/Footer.jsx';
import ScrollToTop from 'assets/Helpers/js/ScrollToTop';
import GameBottomNavigation from 'components/Helpers/GameBottomNavigation.jsx';

const checkIfHeadingIsNeeded = heading => {
  if (heading !== 'undefined') {
    return (
      <section>
          <div id="main-header">
              {heading}
          </div>
      </section>
    );
  }
  else return ('');
}

const WebPage = props => (
  <div>
    {
      (props.doesScrollToTop)
      ?
        <ScrollToTop />
      :
        ""
    }
    <head>
      <meta name="viewport" content="user-scalable=no, width=device-width" />
      {(!props.embeddedPageMode) ? document.title = props.pageTitle + ' - Online Tic-Tac-Toe - J.A.A. Productions' : ''}
    </head>

    {
        (props.headerFooterShow) ? 
        <Header 
          headerType={props.headerType}
          pageTitle={props.pageTitle}
          isHeaderDisappearing={props.isHeaderDisappearing}
          adminSettingsFABActionData={props.adminSettingsFABActionData}
        /> 
        : ''
      }

      <article>
        {checkIfHeadingIsNeeded(props.pageHeading)}
        {props.children}
        {(props.showBottomNav) ? <p style={{ backgroundColor: 'transparent', marginBottom: '10em' }}></p> : ""}
        {/* <Fab id="scroll-to-top-fab" onClick={scroll}><UpIcon /></Fab> */}
      </article>
      {(props.showBottomNav) ? <GameBottomNavigation navActions={props.navActions} /> : (props.headerFooterShow) ? <Footer /> : ""}
  </div>
);

WebPage.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  pageHeading: PropTypes.string,
  headerFooterShow: PropTypes.bool,
  headerType: PropTypes.string,
  isHeaderDisappearing: PropTypes.bool,
  embeddedPageMode: PropTypes.bool,
  doesScrollToTop: PropTypes.bool,
  adminSettingsFABActionData: PropTypes.shape({ actions: PropTypes.array, keepOpen: PropTypes.bool }),
  showBottomNav: PropTypes.bool,
  navActions: PropTypes.shape({ label: PropTypes.string.isRequired, icon: PropTypes.object }).isRequired,
};

WebPage.defaultProps = {
  pageTitle: 'Webpage',
  pageHeading: 'undefined',
  headerFooterShow: true,
  headerType: 'Normal',
  isHeaderDisappearing: false,
  embeddedPageMode: false,
  doesScrollToTop: true,
  adminSettingsFABActionData: { actions: [], keepOpen: false },
  showBottomNav: false,
  navActions: [],
}

export default WebPage;