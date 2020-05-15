import React from 'react';
//import { Link } from 'react-router-dom';
import WebPage from 'components/Helpers/WebPage.jsx';
import inkVid from 'assets/Helpers/images/link.mp4';

import 'assets/Welcome/css/welcomeStyle.css';

export default () => (
    <WebPage pageTitle="Welcome" pageHeading="Welcome!">
        <section>
            <video autoPlay muted loop id="myVideo">
                <source src={inkVid} type="video/mp4" />
            </video>
            <div className="vid-content">
                <div className="info-header" style={{ textAlign: 'center' }}>WEB DEVELOPMENT SERVICES</div>
                <br />
                <p>Need a Website to promote your business or an event, e.g weddings, and fundraisers. We can help!</p>
                <p>With our web development services, we can create your own website or provide technical support for your existing website, e.g updating, and maintenance. Lets tailored a website to your needs.</p>
            </div>
        </section>
    </WebPage>
);