import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import WebPage from 'components/Helpers/WebPage.jsx';

import 'assets/Welcome/css/welcomeStyle.css';

export default () => (
    <WebPage pageTitle="Welcome" pageHeading="Welcome!">
        <section>
            <div style={{ textAlign: 'center' }}>
                <div className="info-header">TIC TAC TOE!</div>
                <br />
                <Link to="/game"><Button color="success">Let's play some Tic Tac Toe! <span role="img" aria-label="happy face">😃</span></Button></Link>
            </div>
        </section>
    </WebPage>
);