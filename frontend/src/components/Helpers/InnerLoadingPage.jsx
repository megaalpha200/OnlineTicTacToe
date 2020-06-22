import React from 'react';
import { Spinner } from 'reactstrap';

function InnerLoadingPage() {
    return(
        <section>
            <h2 style={{textAlign: "center", fontStyle: "italic"}}>Loading...</h2><br />
            <div className="d-flex justify-content-center">
                <Spinner type="grow" color="dark" style={{width: "5rem", height: "5rem"}} role="status"></Spinner>
            </div>
        </section>
    );
}

export default InnerLoadingPage;