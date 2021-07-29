import React from 'react';
import Webpage from 'components/Helpers/WebPage.jsx';
import { Spinner } from 'reactstrap';

const Loading = () => (
    <Webpage pageTitle="Loading..." pageHeading="">
        <section>
            <h2 style={{textAlign: "center", fontStyle: "italic"}}>Loading...</h2><br />
            <div className="d-flex justify-content-center">
                <Spinner type="grow" color="dark" style={{width: "5rem", height: "5rem"}} role="status"></Spinner>
            </div>
        </section>
    </Webpage>
);

export default Loading;