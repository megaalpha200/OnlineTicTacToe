import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import WebPage from 'components/Helpers/WebPage.jsx';

import 'assets/Welcome/css/welcomeStyle.css';

const Welcome = () => (
    <WebPage pageTitle="Home">
        <section></section>
        <br /><br />
        <section>
            <Link to="/game">
                <Button color="success" style={{ fontSize: '2rem', textAlign: 'center', width: '100%', height: '100%', padding: '2rem' }}>
                    <span role="img" aria-label="game controller">🎮</span>&nbsp;Play&nbsp;<span role="img" aria-label="game controller">🎮</span>
                </Button>
            </Link>
        </section>
        <br /><br /><br /><br />
        <section></section>
    </WebPage>
);

export default Welcome;