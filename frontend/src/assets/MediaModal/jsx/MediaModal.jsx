import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner, Modal, ModalHeader, ModalBody } from 'reactstrap';
import 'bootstrap/dist/js/bootstrap';
import 'assets/MediaModal/css/MediaModal.css';

const ModalCloseButton = (props) => (
    <>
        <div className="modal-close-btn-container">
            <Button color="danger" className="modal-close-btn" onClick={props.handleToggle}>
                <span>&times;</span>
            </Button>
        </div>
    </>
);

class MediaModal extends Component {

    state = {
        isOpen: this.props.isOpen,
        isLoading: true,
    }

    hideLoadingSpinner = () => {
        this.setState({ isLoading: false });
    }
    
    renderModalBody = () => {
        var component = <></>;

        switch (this.props.type.toLowerCase()) {
            case 'video':
                component = <video className="modal-media-contents-video" controls><source src={this.props.src} type="video/mp4"></source></video>;
                break;
            case 'image':
                component = <img className="modal-media-contents-img" src={this.props.src} alt={this.props.alt} />;
                break;
            case 'youtube':
                component = <iframe id="modal-media-contents-video" title="YouTube Video" src={this.props.src} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;
                break;
            case 'web':
                component = (
                    <>
                        {(this.state.isLoading) ? <Spinner color="primary" className="loading-spinner"></Spinner> : null}
                        <iframe id="modal-media-contents-web" title={this.props.title} src={this.props.src} frameborder="0" allowFullScreen onLoad={this.hideLoadingSpinner}></iframe>
                    </>
                );
                break;
            default:
                component = <></>;
        }

        return component;
    };

    handleToggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    render() {
        return (
            <>
                <Modal modalClassName="media-modal" zIndex={9999} centered={true} size="xl" isOpen={this.state.isOpen} toggle={this.handleToggle} onClosed={() => { if (!this.state.isOpen) this.props.modalToggleCallback(); }}>
                    {
                        (this.props.title === '') 
                        ? 
                            <></> 
                        : 
                            <>
                                <ModalHeader>{this.props.title}</ModalHeader>
                                <ModalCloseButton title={this.props.title} handleToggle={this.handleToggle} />
                            </>
                    }
                    <ModalBody className="modal-media-container">
                        {
                            (this.props.title === '') 
                            ?
                                <>
                                    <ModalCloseButton title={this.props.title} handleToggle={this.handleToggle} />
                                    <br />
                                    <br />
                                </>
                            :
                                <></> 
                        }
                        {this.renderModalBody()}
                    </ModalBody>
                    {/* <ModalFooter>
                    </ModalFooter> */}
                </Modal>
            </>
        );
    }
};

MediaModal.propTypes = {
    modalToggleCallback: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    title: PropTypes.string,
};

MediaModal.defaultProps = {
    isOpen: true,
    title: '',
};

class MediaModalTarget extends Component {
    state = {
        isModalActive: false,
    };

    openModal = () => this.setState({ isModalActive: true });
    closeModal = () => this.setState({ isModalActive: false });

    injectOnClickToTarget = (target) => {
        const targetClass = target.props.class;
        var targetClassName = target.props.className;
        
        if (!targetClassName) targetClassName = "";
        if (targetClass) targetClassName = `${targetClassName} ${targetClass}`;

        return React.cloneElement(target, { className: `${targetClassName} media-modal-target`, onClick: this.openModal });
    }

    render() {
        return(
            <>
                {this.injectOnClickToTarget(this.props.target)}
                {
                    (this.state.isModalActive)
                    ?
                        <MediaModal modalToggleCallback={this.closeModal} isOpen={this.state.isModalActive} title={this.props.title} {...this.props} />
                    :
                        <></>
                }
            </>
        );
    }
}

MediaModalTarget.propTypes = {
    target: PropTypes.instanceOf(Object).isRequired,
    type: PropTypes.oneOf(['image', 'video', 'youtube']).isRequired,
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
};

MediaModalTarget.defaultProps = {
    target: <></>,
    type: 'image',
    src: '',
    title: '',
};

export default MediaModalTarget;