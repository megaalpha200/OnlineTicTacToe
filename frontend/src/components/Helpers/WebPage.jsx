import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';
import 'assets/Helpers/css/mainStyle.css';
import Header from 'components/Helpers/Header.jsx';
import Footer from 'components/Helpers/Footer.jsx';

function checkIfHeadingIsNeeded(heading) {
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

class WebPage extends React.Component {
  render() {
    return (
      <div>
        <head>
          <meta name="viewport" content="user-scalable=no, width=device-width" />
          {(!this.props.embeddedPageMode) ? document.title = this.props.pageTitle + ' - Tic Tac Toe' : ''}
        </head>
  
        {
            (this.props.headerFooterShow) ? 
            <Header 
              headerType={this.props.headerType}
              pageTitle={this.props.pageTitle}
              isHeaderDisappearing={this.props.isHeaderDisappearing}
            /> 
            : ''
          }
  
          <article>
            {checkIfHeadingIsNeeded(this.props.pageHeading)}
            {this.props.children}
          </article>
          {(this.props.headerFooterShow) ? <Footer /> : ''}
      </div>
    );
  }
}

WebPage.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  pageHeading: PropTypes.string,
  headerFooterShow: PropTypes.bool,
  headerType: PropTypes.string,
  isHeaderDisappearing: PropTypes.bool,
  embeddedPageMode: PropTypes.bool,
};

WebPage.defaultProps = {
  pageTitle: 'Webpage',
  pageHeading: 'undefined',
  headerFooterShow: true,
  headerType: 'Normal',
  isHeaderDisappearing: false,
  embeddedPageMode: false,
}

export default WebPage;