import React from 'react';
import { Link } from 'react-router-dom';
import WebPage from 'components/Helpers/WebPage.jsx';
import { Button } from 'reactstrap';

const Page404 = () => (
    <WebPage pageTitle="Page Not Found" pageHeading="Page Not Found!">
        <section style={{ textAlign: 'center' }}>
            <Link to="/"><Button color="dark">Click Here to Navigate to the Homepage</Button></Link>
        </section>
    </WebPage>
);

export default Page404;