import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Share } from '@material-ui/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactSnackbar from 'react-js-snackbar';

const ShareButton = props => {
    const [isSnackbarShowing, setIsSnackbarShowing] = useState(false);

    const showSnackbar = () => {
        if (isSnackbarShowing) return;

        setIsSnackbarShowing(true);
        setTimeout(() => {
            setIsSnackbarShowing(false);
        }, 2000);
    }

    const onShare = () => {
        const {
            url, text, title
        } = props;
    
        window.navigator.share({ title, text, url })
        .then(() => {})
        .catch(() => {});
    }

    const shareBtnOnClickFunction = (window.navigator.share) ? onShare : () => {};

    const injectOnClickToTarget = (target) => {
        const targetClass = target.props.class;
        var targetClassName = target.props.className;
        
        if (!targetClassName) targetClassName = "";
        if (targetClass) targetClassName = `${targetClassName} ${targetClass}`;

        return React.cloneElement(target, { className: `${targetClassName}`, onClick: shareBtnOnClickFunction });
    }

    const renderShareTarget = () => {
        const shareTarget = (props.target) ? injectOnClickToTarget(props.target) : <Button id="share-button" color="primary" onClick={shareBtnOnClickFunction}>Share&nbsp;<Share /></Button>;

        if (window.navigator.share) {
            return shareTarget;
        }
        else {
            return (
                [
                    <CopyToClipboard text={props.url} onCopy={showSnackbar}>
                        {shareTarget}
                    </CopyToClipboard>,
                    <ReactSnackbar Icon={<Share />} Show={isSnackbarShowing}>
                        Link Copied!
                    </ReactSnackbar>
                ]
            );
        }
    }

    return renderShareTarget();
}

ShareButton.propTypes = {
    text: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
    target: PropTypes.object
}

ShareButton.defaultProps = {
    text: '',
    url: '',
    title: '',
}

export default ShareButton;