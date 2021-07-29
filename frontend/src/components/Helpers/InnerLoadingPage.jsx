import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

const InnerLoadingPage = props => (
    <section>
        {
            (props.spinnerOnly)
            ?
                ""
            :
                <div><h2 style={{textAlign: "center", fontStyle: "italic"}}>Loading...</h2><br /></div>
        }
        <div className={`d-flex justify-content-${props.align}`}>
            <Spinner type="grow" color="dark" style={{width: `${props.size}rem`, height: `${props.size}rem`}} role="status"></Spinner>
        </div>
    </section>
);

InnerLoadingPage.propTypes = {
    spinnerOnly: PropTypes.bool,
    align: PropTypes.string,
    size: PropTypes.number
};

InnerLoadingPage.defaultProps = {
    spinnerOnly: false,
    align: 'center',
    size: 5
}

export default InnerLoadingPage;